# AGENTS.md

## Stack + Commands (source of truth)
- Package manager is `pnpm` (lockfile present; CI uses `pnpm@latest`).
- Main commands:
  - `pnpm dev` -> local Astro dev server
  - `pnpm build` -> production build to `dist/` (primary verification step)
  - `pnpm preview` -> preview built output
  - `pnpm astro check` -> Astro/TS diagnostics when needed
- There are no dedicated `lint` or `test` scripts in `package.json`; do not invent them.

## Deployment + CI
- GitHub Pages deploy workflow is `.github/workflows/astro.yml`.
- Auto-deploy runs on pushed tags matching `v*` (and manual dispatch), not on every push to main.
- CI uses Node `24` via `withastro/action@v5`.

## Architecture Map
- Single Astro site (not a monorepo).
- Route entrypoints live in `src/pages/`:
  - `index.astro` home
  - `projects.astro` projects
  - `blog/index.astro` blog listing
  - `blog/[...slug].astro` blog posts
- Shared page shell is `src/layouts/Layout.astro` (`BaseHead`, `Header`, `Footer`, optional background slot).
- Home page uses a React Three Fiber background (`src/components/PuzzleScene.tsx`) mounted with `client:load`.

## Content + SEO Conventions
- Blog content comes from `src/content/blog/*.{md,mdx}` via `src/content.config.ts`.
- Blog frontmatter required fields: `title`, `description`, `pubDate`, `tag`; optional: `updatedDate`, `heroImage`.
- Open Graph images are generated from blog collection in `src/pages/open-graph/[...route].ts` using `public/metadata-template.jpg` and local Inter fonts.
- Site-wide metadata defaults are in `src/consts.ts`; head tags and font preloads are in `src/components/BaseHead.astro`.

## Styling Rules (repo-specific)
- Use **Tailwind CSS v4 utility classes by default**.
- Only add/edit custom CSS in `src/styles/global.css` when utilities are insufficient or when updating shared design tokens/components (for example: `:root` variables, `.panel`, `.section-kicker`).
- Keep custom CSS minimal and system-level; avoid one-off page-specific CSS when a utility class works.
- Keep horizontal overflow guarded (`html`/`body` currently enforce `overflow-x: hidden`); validate mobile layouts for accidental horizontal scroll.

## Current Design Direction (preserve unless asked to change)
- Visual style: **neo-editorial, professional, clean, dark atmospheric UI**.
- Brand accents: mature pink accent over slate/dark neutrals; avoid random palette shifts.
- Motion: subtle and purposeful only (no noisy animations).
- Personality: confident + warm copy tone, puzzle-solving identity, adaptable cross-platform engineer positioning.
- Header is intentionally compact (content-width nav, social icons on sides, links: Home/Projects/Blog).

## Implementation Guardrails
- Prefer editing source files under `src/`; do not edit generated outputs under `.astro/` or `dist/`.
- Match existing formatting conventions from `.prettierrc` (tabs, width 120, semicolons).
- After non-trivial UI/content changes, run `pnpm build` before handing off.
