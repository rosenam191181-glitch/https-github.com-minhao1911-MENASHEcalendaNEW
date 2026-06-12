# Menashe Calendar

A sacred Jewish calendar app for the Bnei Menashe community — featuring Hebrew/Jewish calendar, Zmanim (prayer times), Parasha, Daf Yomi, holidays, and a Siddur library with community books.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind CSS
- Jewish calendar: `@hebcal/core`, `suncalc`

## Where things live

- `artifacts/menashe-calendar/src/` — React frontend
  - `pages/` — Home, CalendarPage, ZmanimPage, SiddurPage, SettingsPage, Landing, TorahPage
  - `modals/` — Location, Day, Holidays, Parashah, DafYomi, Zmanim, Birthday, Tahara, Yartzeit, Community, Census, BookReader, Admin, Premium, TorahNote
  - `components/BottomNav.tsx` — bottom navigation bar
  - `lib/` — hebrewCalendar, zmanim, parasha, parashaInsights, locations
- `artifacts/api-server/src/routes/books.ts` — Books CRUD API (ADMIN_PIN = "1948")
- `lib/db/src/schema/books.ts` — Books table schema
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)

## Architecture decisions

- Frontend uses plain `fetch` to `/api/books` rather than generated React Query hooks (SiddurPage is pre-existing implementation)
- Admin access uses a simple PIN header (`x-admin-pin: 1948`) rather than full auth
- Hebrew calendar calculations done client-side with `@hebcal/core`
- Zmanim (prayer times) calculated client-side with `suncalc`
- Location preference persisted in `localStorage`

## Product

- Landing page with Sign In (no actual auth — just a gate)
- Home: today's Hebrew date, Zmanim summary, current Parasha, upcoming holidays, Siddur Library shortcut, Daf Yomi
- Calendar: full month view with Hebrew dates and holidays
- Zmanim: detailed prayer times for the selected location
- Siddur: library of sacred texts/books with admin CRUD
- Settings: theme toggle, location picker, community tools

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Admin PIN is hardcoded as `1948` (set via `ADMIN_PIN` env var on the server)
- Seed the books library via `POST /api/books/seed` with `x-admin-pin: 1948` header
- The Sign In on the landing page is a simple state gate — no real authentication

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
