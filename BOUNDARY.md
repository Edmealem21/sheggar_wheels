# BOUNDARY — Server / Client Component Split

## Rule of thumb

- **Server by default.** Every `app/**/page.tsx`, `layout.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts` is a Server Component.
- **Client only where the browser is required.** Anything touching localStorage/sessionStorage, React state/effects, event handlers, Recharts or Leaflet carries `"use client"`.

## Server Components (no `"use client"`)

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: loads Inter via `next/font/google`, sets `metadataBase` from `NEXT_PUBLIC_SITE_URL`, wraps children in `StoreProvider` |
| `app/(public)/layout.tsx` | Thin server wrapper rendering the client `PublicLayout` |
| `app/(renter)/layout.tsx`, `app/(owner)/layout.tsx`, `app/(admin)/layout.tsx` | Thin server wrappers rendering the client `DashShell` with that area's nav items |
| Every `page.tsx` | Exports `metadata` (title/description; dashboards also `robots: { index: false }`) and renders exactly one client page component from `components/pages/*` |
| `app/sitemap.ts`, `app/robots.ts` | Metadata routes |

## Client Components (`"use client"`)

| File | Why client |
|---|---|
| `components/store.tsx` | StoreProvider: initializes seeds, reads/writes storage, toast state, `storage` event listener |
| `components/ui.tsx` | Interactive primitives (buttons, modals, tabs, pagination, `SafeImage` with `onError` fallback) |
| `components/layouts.tsx` | `PublicLayout`, `DashShell` (route guards), `Denied` — need store + router |
| `components/map.tsx` | Leaflet; dynamically imported inside `useEffect`, never during SSR |
| `components/pages/*.tsx` | All page bodies: forms, tables, charts, booking flows |

## The boundary contract

- Server components pass only **serializable props** (strings, nav item arrays) to client components.
- `page.tsx` files never import storage or call rule functions — data access is exclusively client-side. This is deliberate: in this demo the "database" is the browser, so the server has nothing to fetch.
- Client page components import business rules from `lib/*` and call them inside event handlers, then `refresh()` the store.
- Third-party browser-only libraries never leak into server code: Leaflet is `await import("leaflet")` in an effect; Recharts is imported only by client components.

## What would move in a real backend version

The `lib/*` rule functions are written as pure-ish business logic returning `{ ok, data | error }`. With a real backend they would become server actions / route handlers, the storage helpers would be replaced by DB queries, and the client/server boundary would shift so pages could be server-rendered with real data. See FUTURE.md.
