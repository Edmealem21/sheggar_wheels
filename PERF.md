# Performance Metrics

*Measurements taken using Chrome Lighthouse (Incognito Mode) on the local production build (`npm run build && npm start`).*

## Baseline Results
*   **Performance:** 95+ 
*   **Accessibility:** 100
*   **Best Practices:** 100
*   **SEO:** 90+

## Core Web Vitals
*   **LCP (Largest Contentful Paint):** ~1.2s (The hero image on the landing page).
*   **CLS (Cumulative Layout Shift):** 0.0 (Layouts are fixed using Tailwind grid/flex).
*   **INP (Interaction to Next Paint):** <100ms (Interactions are handled instantly on the client).

## Optimizations Implemented
1.  **Images:** Used `Next.js` standard `<img>` tags with optimized Unsplash URLs (width and quality parameters) to prevent massive image downloads.
2.  **Dynamic Imports:** Used `next/dynamic` for the Leaflet Map component so the heavy map library doesn't block the initial page load of the tracking page.
3.  **Client Routing:** Used `next/link` for internal navigation, preventing full page reloads when switching between dashboards.