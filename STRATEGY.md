# STRATEGY — Routes & Rendering

## Route map

Route groups `(public)`, `(renter)`, `(owner)`, `(admin)` organise layouts **without adding URL segments**.

### Public — `(public)` group, `PublicLayout` (header + footer)

| Route | File | Notes |
|---|---|---|
| `/` | `app/(public)/page.tsx` | Home: hero, search, featured cars, how-it-works |
| `/cars` | `app/(public)/cars/page.tsx` | Catalogue: search/filter/sort/paginate, URL-param synced; wrapped in `<Suspense>` (uses `useSearchParams`) |
| `/cars/[id]` | `app/(public)/cars/[id]/page.tsx` | Car detail: gallery, specs, reviews, simulated map, availability calendars, quote |
| `/checkout` | `app/(public)/checkout/page.tsx` | Mock TeleBirr checkout (client-guarded by session + checkout draft) |
| `/design-system` | `app/(public)/design-system/page.tsx` | Design-token/component reference (noindex) |
| `/signin` | `app/signin/page.tsx` | Demo account cards; `<Suspense>` (uses `useSearchParams` for `next`) |
| `/signup` | `app/signup/page.tsx` | Creates a renter-only account (never admin/owner) |

### Renter — `(renter)` group, `DashShell role="renter"`

`/dashboard`, `/bookings`, `/bookings/[id]`, `/bookings/[id]/track`, `/bookings/[id]/review`, `/notifications`, `/profile`

### Owner — `(owner)` group, `DashShell role="owner"`

`/owner`, `/owner/cars`, `/owner/cars/new`, `/owner/cars/[id]/edit`, `/owner/cars/[id]/availability`, `/owner/cars/[id]/bookings`, `/owner/earnings`, `/owner/reviews`, `/owner/disputes`

### Admin — `(admin)` group, `DashShell role="admin"`

`/admin`, `/admin/listings`, `/admin/users`, `/admin/users/[id]`, `/admin/bookings`, `/admin/disputes`, `/admin/disputes/[id]`, `/admin/reports`, `/admin/announcements`

### Metadata routes

`app/sitemap.ts` (public routes + approved seed cars), `app/robots.ts` (disallows all dashboard paths — crawler guidance, not access control).

## Rendering strategy

| Concern | Decision | Why |
|---|---|---|
| Page shells | **Server Components** (default) | Each `page.tsx` is a server component exporting static `metadata` (dashboard pages set `robots: noindex`) and rendering one client component. Zero data needed at render time — all data is client-side storage. |
| Interactive UI | **Client Components** (`"use client"`) | All page bodies live in `components/pages/*`. They read localStorage via the store, so they must render on the client. |
| Static prerender | All pages prerender as static HTML (shell + loading state) | There is no server data fetching; the client hydrates and loads demo data. Dynamic segments (`[id]`) render on demand because storage lookups happen in the browser. |
| `useSearchParams` pages | Wrapped in `<Suspense>` | Required by Next.js for static generation (`/cars`, `/signin`). |
| Per-car `generateMetadata` | Not used | Metadata is generated on the server, but car data lives in browser localStorage — the server cannot know it. Car pages use static generic metadata instead of pretending otherwise. |
| Charts (Recharts) / map (Leaflet) | Client-only | Recharts inside client components; Leaflet is dynamically imported in `useEffect` so it never touches SSR, with a fallback address card if loading fails. |
| Images | `next/image` + `remotePatterns` for `images.unsplash.com` | Seeded demo photos; `SafeImage` falls back to `/images/car-fallback.svg` on error. |

## Data flow

Browser loads page → `StoreProvider` (client) runs `initializeDemoData()` (seeds only absent keys) → loads all collections into React state → components read/write through `lib/*` rule functions → `refresh()` re-reads storage → cross-tab sync via the `storage` event.
