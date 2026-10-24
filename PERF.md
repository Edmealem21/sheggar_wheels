# PERF — Performance Notes & Repeatable Measurement Procedure

No performance scores are claimed here. This file documents what was done for performance and how to measure it yourself.

## Built-in measures

- **Static prerendering** — every route prerenders as static HTML (verified in the `npm run build` output: all pages `○ Static`, dynamic `[id]` segments render on demand).
- **Server/client split** — page shells are Server Components; only interactive islands ship client JS (see BOUNDARY.md).
- **`next/image`** — seeded remote photos served through the Next.js image optimizer with explicit `remotePatterns`; `SafeImage` swaps to a lightweight local SVG on error.
- **`next/font/google` (Inter)** — self-hosted at build time, no runtime font request, `display: swap`.
- **Leaflet isolation** — the map library is dynamically imported in `useEffect` on the single car-detail page, so its bundle is never loaded on other routes.
- **Charts on dashboard pages only** — Recharts is imported only by owner/admin overview & earnings components, so public pages don't pay for it.
- **Bundle budget** — from the production build: shared first-load JS ≈ 102 kB (gzip); heaviest pages are the two chart dashboards (`/owner`, `/owner/earnings`, `/admin` ≈ 235–245 kB first load), public pages ≈ 122–128 kB.

## Repeatable measurement procedure

1. **Build info**
   ```bash
   npm run build
   ```
   Record the route table (size / first-load JS) printed at the end.

2. **Lighthouse (lab)**
   ```bash
   npm run build && npm start   # serve the production build on :3000
   ```
   In Chrome: DevTools → Lighthouse → categories *Performance, Accessibility, Best Practices, SEO* → mode *Navigation (desktop)*, then repeat as *Mobile*. Run against `/`, `/cars`, `/cars/c1`, `/signin`. Note that seeded photos load from `images.unsplash.com`, so network conditions affect LCP; run 3 times and take the median.

3. **WebPageTest / field data** (after deploying)
   - Deploy, then test the same four URLs from a Frankfurt or Nairobi location, 4G throttling.
   - Record LCP, INP, CLS per page.

4. **Interaction responsiveness** (manual)
   - Catalogue filtering/sorting/pagination and dashboard tables operate on in-memory collections (≤ dozens of records in the seed), so interactions should be instant; verify with DevTools Performance recording if the dataset grows.

## Known costs

- Remote Unsplash photos and OpenStreetMap tiles are third-party requests outside our control (both have local fallbacks).
- All demo data is parsed from localStorage on first load — trivial at seed size, but `initializeDemoData` is O(collections) JSON parse per tab load.
