---
title: "How Live Dumps Work in Phant"
description: "A practical look at how Phant captures dump() and dd() calls internally and turns them into live events in the desktop app."
pubDate: "May 19 2026"
tag: "tools"
heroImage: "/phant-hero-image.jpg"
---

One of the features I wanted most in **Phant** was live dump capture.

As PHP developers, we use `dump()` and `dd()` all the time, but the output usually ends up scattered across the browser, CLI sessions, queue workers, or cron runs. That makes debugging noisier than it needs to be.

In Phant, the goal is different: send those dump events into one desktop app and make them visible in real time.

This post explains how that works internally without going too deep into every implementation detail.

## The short version

Phant's live dump system works like a small local event pipeline:

1. A PHP prepend script intercepts `dump()` and `dd()`.
2. It normalizes the payload into JSON.
3. It sends one event as one NDJSON line through a Unix socket.
4. A local collector inside Phant reads and validates the event.
5. The desktop app stores it in memory and pushes it to the UI.

That is the whole idea.

## Step 1: Phant installs a PHP prepend hook

Phant writes a prepend script into the user config directory and then wires PHP to load it automatically.

On Linux, the preferred path is writing a dedicated `99-phant.ini` file into the detected `conf.d` directory so PHP uses:

```ini
auto_prepend_file=".../phant_prepend.php"
```

This is important because it means Phant does not need you to modify every project manually. Once the hook is active, new PHP processes can emit dump events to Phant automatically.

For HTTP requests, the same idea is applied to detected PHP-FPM targets when Valet Linux is involved.

## Step 2: The prepend script overrides dump behavior

The prepend script defines custom `dump()` and `dd()` functions when they are not already available, and it also installs a Symfony VarDumper handler when possible.

That gives Phant two important things:

- compatibility with normal PHP/Laravel dump workflows
- a central place where dump payloads can be captured before they disappear into normal output

The script also marks whether the current event came from `dd()` so the event metadata can reflect that.

## Step 3: The payload is normalized into JSON

Dump output is not always simple text.

It can be:

- scalars
- arrays
- nested associative data
- objects
- recursive object references
- resources

Phant normalizes that data into a JSON-friendly structure before sending it.

For example, objects are converted into a structured payload that includes:

- class name
- object id
- normalized properties

Recursive references are also handled explicitly so the payload stays valid and the app does not explode on circular structures.

This is one of the most important parts of the system because the desktop app needs structured data, not raw terminal formatting.

## Step 4: Each dump becomes one event

Phant does not send raw text lines from `var_dump()`.

It sends one structured event per dump.

The event includes metadata such as:

- schema version
- event id
- timestamp
- source type like `http`, `cli`, `worker`, or `cron`
- project root
- PHP SAPI
- whether the event came from `dd()`
- normalized payload
- trace information
- host and process information

This event is encoded as JSON.

Then Phant writes it as a single newline-delimited JSON line, also known as **NDJSON**.

## Step 5: Transport uses a Unix socket

The PHP side sends events through a local Unix domain socket.

That choice is useful here because the transport is:

- local only
- simple
- fast
- easy to frame line by line

The prepend script opens a short-lived socket connection, writes the JSON line, and closes it.

It also uses a very small timeout because dump capture should not turn into a heavy blocking operation inside the PHP request itself.

## Step 6: The collector receives and validates the event

Inside Phant, a collector server listens on that socket.

It reads the stream line by line. For every line:

1. trim whitespace
2. ignore empty lines
3. decode the JSON
4. verify required keys exist
5. validate the event contract

This validation is important because Phant treats dump transport as a real contract, not just a loose string channel.

For example, it checks things like:

- supported schema version
- valid timestamp format
- required `http` metadata for HTTP events
- required `command` metadata for CLI, worker, or cron events
- valid JSON payload

Invalid lines are dropped instead of crashing the collector.

## Step 7: Events are buffered in memory

Valid events are stored in a bounded ring buffer.

This means the app keeps a recent in-memory history without allowing unlimited growth if a project becomes noisy.

If too many events arrive, old ones are dropped and the collector tracks how many were discarded.

That tradeoff keeps the app responsive while still preserving the most recent debugging information.

## Step 8: The desktop UI receives live updates

Once the collector accepts an event, Phant broadcasts it to subscribers inside the app runtime.

The frontend uses two modes:

- it pulls recent events for initial page load
- it listens for live runtime events for real-time updates

That combination keeps the `Dumps` view useful both when you first open it and while new dumps continue to arrive.

![Phant Dumps View](/phant-dumps.png)

## Why I like this approach

What I like most about this design is that it stays simple.

There is no remote service, no external queue, and no extra infrastructure.

It is just:

- PHP hook
- normalized event
- local socket
- collector
- desktop UI

That makes the feature easier to reason about and easier to evolve.

It also gives Phant a solid base for handling dump events from different execution contexts, not only browser requests.

## Phant v1.0.0 is available

This live dump pipeline ships as part of **Phant v1.0.0**.

If you want to check out the project:

- Website: https://phant-app.github.io/
- Source: https://github.com/phant-app/phant

If you are building PHP applications on Linux and want better visibility into your local environment, Phant is worth a look.
