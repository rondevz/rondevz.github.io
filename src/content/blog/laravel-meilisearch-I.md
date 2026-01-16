---
title: "Laravel: Vector Search 101 using Scout, Meilisearch & OpenRouter"
description: "A simple guide on how to implement vector search with Meilisearch, OpenRouter and Laravel Scout."
pubDate: "Jan 12 2025"
heroImage: "/laravel-meilisearch-scout.jpg"
tag: "laravel"
---

A few months ago, I had the opportunity to work as the Senior Software Engineer for an upcoming AI solution called **M2Local**. This application is an AI Solution for Real Estate designed to give property developers, agents, and customers a smarter experience when interacting with property data.

Our goals were:
- To find the best prices.
- To find the most accurate properties based on vague user specifications.
- To generate price and condition reports by area.

I was in charge of the system design and database architecture. Once the DB structure was ready, I focused on the **RAG (Retrieval-Augmented Generation)** strategy. One of our initial questions was:

> Which Vector Database should we use?

We had previously tried PostgreSQL with the `pgvector` extension, but we decided to try something else. We went with **Meilisearch**.

This article will demonstrate how you can set this up quickly in your Laravel app using Laravel Scout.

# Requirements
- PHP 8.0+
- Meilisearch (running locally or in the cloud)
- Laravel Scout

# Setup
I won't drag you into a long intro, so let's pick up where the documentation leaves off. Let's say we have a `Property` model, and we want to store its data in a vector database so an AI Chat Agent can "read" and understand our inventory.

It might sound difficult, but the Laravel team has already created an awesome driver package to handle this.

# Laravel Scout
This first-party package is a driver-based solution for full-text search on Eloquent models.

> **Is it mandatory to use Laravel Scout?**

Not really. You could write your own service to connect to the database. However, we want to take advantage of Scout because it already has built-in utilities to work with full-text databases (Algolia, Meilisearch, Typesense, MySQL, and PostgreSQL). This means you keep a consistent API regardless of the underlying engine.

You can find the [official documentation for Laravel Scout here](https://laravel.com/docs/12.x/scout#introduction).

To install Laravel Scout, run:

```bash
composer require laravel/scout
```

Next, publish the configuration file:

```bash
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

Finally, add the `Laravel\Scout\Searchable` trait to your `Property` model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Property extends Model
{
    use Searchable;
}
```

And that's it—our model is now searchable! Here are a few quick notes about the trait:
- **Auto-Sync**: It adds a model observer that automatically keeps the search index in sync. When you run `Property::create(...)`, it syncs with Meilisearch immediately.
- **Methods**: It affects methods like `create()`, `delete()`, `update()`, and `save()`.
- **Soft Deletes**: It handles soft deletes automatically.
- **Search**: It adds the `search()` method to your model, which we will use later.

## Configuring the Data Structure

**Why override this?**
By default, Scout serializes your entire model. We override this for two reasons:

- Optimization: We only want to send relevant data to Meilisearch to keep the index size small and searches fast.
- Transformation: We need to format data specifically for the AI or search engine (e.g., casting prices to floats or fetching a city name from a relationship).

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Property extends Model
{
    use Searchable;

	/**
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
		// Ensure relationships are loaded if necessary, or access them directly
        $this->loadMissing(['city']);

        return [
            'id' => $this->id,
			'title' => $this->title,
            'price' => (float) $this->price,
            'operation' => $this->operation->value ?? '', // operation is an Enum
            'property_type' => $this->property_type,
            'bedrooms' => (int) $this->bedrooms,
            'city_name' => $this->city->name ?? '',
        ];
    }
}
```

## Indexes, documents and attributes

If it's your first time working with search engines, the terminology can be confusing. Here is a simple comparison to relational databases:

```
Index = Table
Document = Record
Attribute = Column
```

To define the index, we modify the `config/scout.php` file. Locate the `meilisearch` key and look for `index-settings`:

```php
<?php
[
	'meilisearch' => [
		'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
		'key' => env('MEILISEARCH_KEY'),
		'index-settings' => [
			App\Models\Property::class => [
				'filterableAttributes' => [
					'id',
					'operation',
					'property_type',
					'bedrooms',
					'price',
					'city_name',
				],
				// Define sortable attributes here
				'sortableAttributes' => [
					'price',
				],
			],
		],
	]
]
```

## Embeddings
Now for the exciting part.

>What is an embedding?
An embedding is a list of floating-point numbers (a vector) that represents the semantic meaning of text. Unlike keyword search, which matches words exactly, embeddings allow the computer to understand that "cozy apartment" and "comfortable studio" are conceptually similar.

This step is crucial. This is how Scout tells Meilisearch to process data using an AI provider. The flow looks like this:

```
Format Data -> Send to AI Provider -> AI Model Processes Data -> Receive Vector -> Store in Meilisearch
```

For Meilisearch config, you can decide which data is going to be processed, I recommend you to define a document template (don't worry there's an example bellow). You're able to decide which data is going to be embedded.

### Document Template
In the Meilisearch configuration, you must define a Document Template. This is a liquid-template string that defines exactly what text is sent to the AI to be embedded. It gives the AI context.

### Configuring OpenRouter (Custom REST Embedder)
In my project, I used OpenRouter to access the `text-embedding-3-small model`. Since Meilisearch doesn't have a native "OpenRouter" driver, we use the rest source.
Add this to your `config/scout.php` under your model's settings:

```php
<?php
[
	'meilisearch' => [
		'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
		'key' => env('MEILISEARCH_KEY'),
		'index-settings' => [
			App\Models\Property::class => [
				//...
				'embedders' => [
                    'openrouter' => [
                        'source' => 'rest',
                        'url' => 'https://openrouter.ai/api/v1/embeddings',
                        'apiKey' => env('OPENROUTER_API_KEY'),
                        'dimensions' => 1536,
                        'documentTemplate' => "Property in {{doc.operation}}: Title {{doc.title}}. Located in {{doc.city_name}}. Price: {{doc.price}} | Bedrooms: {{doc.bedrooms}} | Type: {{doc.property_type}}" 
                        'request' => [
                            'model' => 'text-embedding-3-small',
                            'input' => ['{{text}}', '{{..}}'],
                        ],
                        'response' => [
                            'data' => [
                                ['embedding' => '{{embedding}}'],
                                '{{..}}',
                            ],
                        ],
                    ],
                ],
			],
		],
	]
]
```

### Important Observations
- **Dimensions**: This must match the selected model exactly (1536 for text-embedding-3-small).
- **Source**: You can use `openAi`, `ollama`, `huggingFace`, or `userProvided`. Since OpenRouter isn't listed, `rest` is the solution.
- **Request & Response**:
    - The {{text}} placeholder is where Meilisearch inserts your rendered Document Template.
    - The {{..}} syntax is vital—it tells Meilisearch to handle batches of data (arrays), ensuring that if you send 50 properties to be indexed, the response maps back to those 50 properties correctly.

For more details on custom embedders, check the [Meilisearch REST Embedder guide](https://www.meilisearch.com/docs/learn/ai_powered_search/configure_rest_embedder).

# Usage

Now that our database is configured and our models are indexed, how do we actually search?

The beauty of Laravel Scout is that it abstracts the complexity. You don't need to manually generate an embedding for your user's search query, nor do you need to perform complex vector math in PHP.

When you send a search query, Meilisearch receives the text, uses the configured embedder (OpenRouter) to turn that query into a vector, and compares it against your stored documents.

Here is how you use it in your controller or service:

```php
use App\Models\Property;

// The user might search for something vague or descriptive
$query = "cozy place for a student near the center";

// We use the standard Scout search method
$properties = Property::search($query)->get();

return $properties;
```

## Results
Because we are using Vector Search, the system understands the intent behind "cozy place" and "student." Even if the specific words "cozy" or "student" don't appear in the database records, the AI understands the context (small size, lower price, proximity to universities).

The result is a standard `Illuminate\Database\Eloquent\Collection` containing your models. Here is a simulated JSON response of what that collection might look like:

```json
[
  {
    "id": 42,
    "title": "Small Studio - University District",
    "description": "A compact 1-bedroom apartment walking distance to the main campus.",
    "price": 850.00,
    "city_name": "Downtown",
    "_score": 0.89
  },
  {
    "id": 15,
    "title": "Modern Loft",
    "description": "Affordable living space with great bus connections.",
    "price": 900.00,
    "city_name": "Midtown",
    "_score": 0.82
  }
]
```

Notice that the first result matches the concept of a "student place" (University District) even though the word "student" wasn't in the title. That is the power of semantic search.


# Conclusion
Vector search opens up a new world of "semantic" understanding for your applications. By combining Laravel Scout's ease of use with Meilisearch's powerful vector capabilities, you can build RAG systems and smart searches in minutes, not days.

Have you tried implementing vector search in your Laravel apps? Let me know your thoughts!