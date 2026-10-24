# Sheggar Wheels — Peer-to-Peer Car Rental Demo (Addis Ababa)

A **frontend-only demo** of a peer-to-peer car rental marketplace for Addis Ababa, Ethiopia, built with **Next.js (App Router) + React + TypeScript + Tailwind CSS**. The visual design is converted from the supplied Figma Make React design, preserving its colors, typography, spacing, cards and responsive behaviour.

> **Demo data.** Every record lives in your browser's `localStorage` / `sessionStorage`. There is no backend, no database, no real authentication and no real payment. A "Demo data" label is shown in the UI.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (verified working)
npm start          # serve the production build
npm test           # run the automated business-rule tests (vitest)
```

**Deployment URL:** _deploy and paste the URL here_ (any static-capable Next.js host works, e.g. Vercel: import the repo, no environment variables required beyond the optional `NEXT_PUBLIC_SITE_URL`).

## Demo accounts

Sign in at `/signin` by tapping a demo account card (no passwords — this is a demo).

| Account | Email | Roles | Notes |
|---|---|---|---|
| Meron Alemu | meron@demo.sheggar.et | renter | Has past trips, a confirmed upcoming booking |
| Dawit Bekele | dawit@demo.sheggar.et | **owner + renter** | Owns 3 cars; can switch between dashboards |
| Selam Tesfaye | selam@demo.sheggar.et | owner | Owns cars incl. one pending moderation |
| Hana Girma | hana@demo.sheggar.et | owner | Owns cars incl. a draft listing |
| Yonas Haile | yonas@demo.sheggar.et | renter | Has a pending request |
| Rahel Kassa | rahel@demo.sheggar.et | renter | **Suspended** — actions are blocked |
| Liya Mulat | liya@demo.sheggar.et | renter | Party in an open dispute |
| Samuel Teka | samuel@demo.sheggar.et | renter | Has an in-progress trip |
| Admin Demo | admin@demo.sheggar.et | **admin** | Seeded admin; there is no public admin signup |

One account can hold both renter and owner roles (Dawit). The admin role only exists on the seeded admin account.

## What you can do

- **Visitor / renter** — browse the catalogue, search, filter (neighbourhood, price, transmission, seats, availability dates), sort, paginate; view car details with a simulated map and availability calendar; book via a **mock TeleBirr checkout** ("Complete demo payment" — never collects credentials); see the receipt with a fake `DEMO-TXN-*` reference; cancel eligible bookings; track a **simulated** trip; leave a review; export bookings to CSV; see notifications.
- **Owner** — dashboard with earnings/utilization charts; create/edit listings (select photos from a demo pool); block availability dates; approve/decline requests; start/complete trips; view per-car bookings; earnings report with CSV export; reply to reviews; view disputes.
- **Admin** — platform metrics and charts; listing moderation (approve/reject); user suspend/reinstate; all bookings; dispute resolution with notes; mock commission report (8% platform fee) with CSV exports; publish announcements.

## Tech stack & structure

Next.js 15 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4 · Recharts (client charts) · Leaflet (client-only simulated map) · lucide-react icons · vitest.

No `src/` folder:

```
app/            routes (route groups: (public) (renter) (owner) (admin))
components/     shared UI, layouts, store, map + components/pages/* per-page client UIs
lib/            storage, seed, data, session, bookings (rules), actions, csv, format, notifications
types/          shared TypeScript entities
public/images/  local fallback image
tests/          vitest business-rule & negative-scenario tests
```

Docs: [STRATEGY.md](STRATEGY.md) routes & rendering · [BOUNDARY.md](BOUNDARY.md) server/client split · [AUTH.md](AUTH.md) guards & negative tests · [DATA.md](DATA.md) entities & storage keys · [PERF.md](PERF.md) performance procedure · [FUTURE.md](FUTURE.md) next steps.

## Tests & build status (reported truthfully)

- `npm test` — **30 tests, all passing** at the time of writing (booking math, overlap prevention, lifecycle transitions, the three required negative scenarios, storage robustness, CSV quoting).
- `npm run build` — **succeeds** (Next.js 15 production build, all routes compiled, type checking clean).

## Safety rules built into the demo

- No real passwords, payment credentials, tokens or secrets are stored or requested. The checkout is clearly labelled a demo and generates a fake transaction reference.
- Sign-in redirects only to safe internal paths (`safeReturnPath`) — an external `?next=https://…` is ignored.
- Every protected mutation re-checks session, active account, role and ownership inside the business-rule functions, not just in the UI.
- Frontend checks are **not** production security — see [AUTH.md](AUTH.md).

## Known limitations

- Data is per-browser (localStorage); clearing site data resets the demo. Multi-tab sync works via the `storage` event.
- The map and trip tracking are simulated with seeded fictional coordinates; map tiles come from OpenStreetMap (external dependency; a fallback address card shows if tiles fail).
- Car photos are hot-linked from Unsplash (with a local SVG fallback if they fail to load).
- Owner dispute "response" is acknowledged as a demo note only; only the admin can actually resolve disputes.
