# KITS Companies Research & Placement Analytics Portal

**College:** Karunya Institute of Technology and Sciences (KITS)

## Phase 1 — UI only

- 100% **public** portal: no login, no auth, no protected routes.
- All data comes from a single hardcoded seed file: `src/data/seedCompanies.ts`.
- No Supabase, no database, no migrations, no edge functions.
- Built on the project's TanStack Start + TanStack Router stack (file-based routes under `src/routes/`).

## Routes

- `/` — landing grid with search + category filter pills.
- `/company` — redirects to `/company/intelligence`.
- `/company/intelligence` — 22 sections of company intelligence, sticky tabs with scroll-spy.
- `/company/skills` — 12 skills with Bloom badges, criticality, and expandable 10-level roadmaps.

Selection is persisted in `localStorage` under the key `selected-company` and rehydrated on refresh, so deep links to `/company/*` survive reloads.

## Phase 2 (later)

Normalizers in `src/lib/companyData.ts` consume the same JSON shapes (`short_json`, `full_json`, `skill_levels`) that the future Supabase tables will return. Swapping seed → Supabase is a one-file change inside `CompanyContext`.

## Env

- `VITE_LOGO_DEV_PUBLISHABLE_KEY` (optional) — when set, `CompanyLogo` uses Logo.dev; otherwise it falls back to the seed `logo_url`, then to an initial-letter circle.
- `VITE_SUPABASE_URL` — your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — your Supabase anonymous key.

Paste values into `.env`, then run `npm install && npm run dev`.
