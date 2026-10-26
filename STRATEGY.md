 `STRATEGY.md`
This file explains your rendering strategy. Next.js allows you to render on the server or client, and this documents your choices.

```markdown
# Rendering Strategy

This document outlines the rendering strategy for every route in the Sheggar Wheels application. 

Because this is a **frontend-only application** that relies on `localStorage` for data persistence, the server cannot access the user's specific data (bookings, cars, session). Therefore, almost all routes are **Client-Driven**.

| Route | Strategy | Reason |
| :--- | :--- | :--- |
| `/` (Landing) | Client-Driven | Uses `useEffect` to read featured cars from `localStorage` and `useRouter` for the search bar. |
| `/cars` | Client-Driven | Uses `useSearchParams` and filters data pulled from `localStorage`. |
| `/cars/[id]` | Client-Driven | Uses `useParams` to find the specific car in `localStorage`. |
| `/signin` & `/signup` | Client-Driven | Uses forms with `onSubmit` to write session data to `sessionStorage`. |
| `/checkout` | Client-Driven | Reads the selected car and logged-in user from storage to simulate a payment. |
| `/dashboard/*` | Client-Driven | All dashboard pages (Renter, Owner, Admin) require reading the current session from `sessionStorage` and specific data from `localStorage`. |
| `/dashboard/.../track` | Client-Driven (Dynamic) | Uses `next/dynamic` to load the Leaflet Map component only on the client side, avoiding SSR errors with the `window` object. |
| `app/layout.tsx` | **Static** | The root layout has no dynamic data and is pre-rendered at build time. |
| `app/not-found.tsx` | **Static** | A simple fallback page. |

## Why not Static or ISR?
Static generation (SSG) and Incremental Static Regeneration (ISR) are excellent for content that is the same for all users (like a blog). However, our app is highly personalized. The server doesn't know who is logged in or what bookings exist in the user's browser. Thus, rendering on the client is the only viable strategy.