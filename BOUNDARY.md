# Server / Client Boundary

Next.js 15 uses React Server Components (RSC) by default. This means components are rendered on the server unless explicitly marked with `"use client"`.

## The Boundary Rule
**Browser APIs (`window`, `localStorage`, `sessionStorage`) and React Hooks (`useState`, `useEffect`) can only be used inside Client Components.**

Because our entire data layer is built on `localStorage`, the boundary line is pushed heavily toward the client.

### Server Components
These components do not use state or browser APIs, reducing the JavaScript bundle size sent to the user.
*   `app/layout.tsx`: The root layout wrapping the app.
*   `components/layout/Footer.tsx`: Static links and text.

### Client Components
These components require interactivity or browser data.
*   **Layouts:** `app/dashboard/layout.tsx` (requires `sessionStorage` check).
*   **UI Components:** `Sidebar.tsx` (uses `usePathname`), `PublicNavbar.tsx` (uses `useState` for mobile menu).
*   **Maps:** `components/Map.tsx` (Leaflet requires the `window` object).
*   **All Pages:** Every page in `app/(public)` and `app/dashboard` uses `"use client"` because they use `useEffect` to read data from the browser's `localStorage`.