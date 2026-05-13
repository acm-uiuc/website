# AGENTS.md

This repository contains the ACM @ UIUC website, written with Astro, Preact, and TypeScript.

## Commands

Packages are managed with the `yarn` package manager.

```bash
yarn dev          # Start dev server at http://localhost:3000
yarn build        # Production build (output: ./build)
yarn typecheck    # Run astro type checker
yarn format:fix   # Run prettier + eslint with auto-fix
yarn format:check # Check formatting without writing
yarn test:e2e     # Run Playwright e2e tests
```

E2E tests use a running dev server — either start `yarn dev` first, or Playwright will start one automatically when tests run locally. Install browser deps once with `yarn playwright install --with-deps`.

## Architecture

This is a static Astro site (`output: 'static'`) that renders server-side on build and hydrates interactive islands with Preact. The `react` and `react-dom` packages are aliased to `@preact/compat` via yarn resolutions — this allows React-ecosystem libraries (e.g. `react-big-calendar`) to work with Preact.

**Data flow:**

- Astro pages (`.astro`) fetch data from the ACM Core API at build/SSR time (e.g. `index.astro` fetches organizations) and pass it as props to components as `initialData`.
- Preact components (`.tsx`) receive this initial data and may re-fetch from the same Core API on the client side for freshness.
- Global state is managed via **nanostores** atoms and computed stores in `src/stores/`, which Preact components subscribe to via `@nanostores/preact`.

**Authentication:**

- Uses Azure MSAL (`@azure/msal-browser`) for Microsoft/Illinois identity.
- `src/authConfig.ts` exposes `initMsalClient()` and `getUserAccessToken()` helpers.
- Auth flow redirects through `/auth-redirect` page; the `state` param carries the return path.
- Protected pages (membership, admin) use `AuthActionButton.tsx` to trigger login before calling gated API endpoints.

**API clients** (`src/api/index.ts`):

- All API clients are instances from `@acm-uiuc/core-client` (generated SDK).
- Base URLs come from env vars (`PUBLIC_CORE_API_BASE_URL`, `PUBLIC_CORE_API_EVENTS_BASE_URL`, `PUBLIC_CORE_API_ORG_BASE_URL`); default is `https://core.acm.illinois.edu`.
- The dev environment points membership/store APIs at the QA backend (`core.aws.qa.acmuiuc.org`) while events/orgs use production.

**Key directories:**

- `src/pages/` — Astro file-based routing; `.mdx` pages use `ContentLayout` with frontmatter
- `src/components/` — Astro components (`.astro`) for static markup, Preact components (`.tsx`) for interactive islands; `calendar/`, `store/`, `generic/` subdirectories for feature groupings
- `src/layouts/` — Four layouts: `Layout` (standard with navbar/footer), `ContentLayout` (adds hero header, used by MDX), `InteractiveLayout`, `MinimalLayout`
- `src/stores/` — nanostores atoms for organizations and search query state
- `src/api/` — Core API client instances and date utility helpers (`dateutils.ts` handles recurring events with `temporal-polyfill`)
- `src/types/` — Re-exports types from `@acm-uiuc/core-client` (`Event`, `Product`, `Organization`)

**Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Icons via `astro-icon` with `@iconify-json/lucide` and `@iconify-json/simple-icons` icon packs.

**Environment variables** (all prefixed `PUBLIC_`):

- `PUBLIC_CORE_API_BASE_URL` — Core API base (default: prod)
- `PUBLIC_CORE_API_EVENTS_BASE_URL` / `PUBLIC_CORE_API_ORG_BASE_URL` — per-service overrides
- `PUBLIC_AZURE_CLIENT_ID` / `PUBLIC_AZURE_TENANT_ID` — MSAL app registration
- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile (use `1x00000000000000000000AA` for dev bypass)

**Pre-commit hooks** (husky + lint-staged) run prettier and eslint on staged files automatically.

## Testing

E2E tests live in `e2e/` and run with Playwright (`yarn test:e2e`). **Add Playwright coverage for every new user-facing feature or behavioral change** — empty states, error states, and the happy path. The bar is "a future change that breaks this behavior should fail a test," not "every line is covered."

Conventions:

- One spec file per feature/page (e.g. `e2e/upcomingEvents.spec.ts`). Group related cases in a `test.describe` block.
- Mock the Core API with `page.route('**/api/v1/<resource>**', ...)` so tests are deterministic and don't depend on prod data. See `e2e/orglist.spec.ts` for the pattern.
- Cover at minimum: the populated/happy-path render, the empty state, and any interactive affordance the feature adds (clicks, links, navigation).
- Prefer role/text queries (`getByRole`, `getByText`) over CSS selectors; reserve `data-testid` for containers where text queries are ambiguous.
- Run `yarn playwright test <spec> --project=chromium` locally before pushing.
