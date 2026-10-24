# DATA — Entities, Storage Keys & Helpers

## Storage keys

| Key | Storage | Contents |
|---|---|---|
| `sw_users_v1` | localStorage | `User[]` |
| `sw_cars_v1` | localStorage | `Car[]` |
| `sw_bookings_v1` | localStorage | `Booking[]` |
| `sw_reviews_v1` | localStorage | `Review[]` |
| `sw_disputes_v1` | localStorage | `Dispute[]` |
| `sw_announcements_v1` | localStorage | `Announcement[]` |
| `sw_session_v1` | sessionStorage | `{ userId, signedInAt }` |
| `sw_checkout_draft_v1` | sessionStorage | `CheckoutDraft` (carId, startDate, endDate) |

All reads are guarded (`readStorage` / `readSession`): unavailable storage and malformed JSON return a safe fallback instead of throwing.

## Helpers (lib/)

| Helper | Purpose |
|---|---|
| `readStorage(key, fallback)` / `writeStorage(key, value)` | Guarded localStorage JSON read/write |
| `hasStorageKey(key)` | Existence check used by seeding |
| `readSession` / `writeSession` / `removeSession` | Same for sessionStorage |
| `initializeDemoData()` | Seeds every key **only when absent** — never overwrites user data |
| `resetDemoData()` | Rewrites all seed data and signs out (development control) |
| `getUsers/getCars/getBookings/getReviews/getDisputes/getAnnouncements` (+`save*`) | Collection accessors |
| `getPublicCars()` | Approved cars whose owner account is active (catalogue visibility rule) |
| `getCurrentSession()` / `getCurrentUser()` | Session resolution |
| `signInAsDemo(userId)` / `signOut()` | Demo session lifecycle (sign-out also clears the checkout draft) |
| `hasRole(user, role)` / `isActive(user)` | Capability checks |
| `safeReturnPath(value)` | Internal-path-only redirect target |
| `computeQuote(car, start, end)` | Days, subtotal, 8% fee, total |
| `blockedDates` / `isRangeAvailable` | Calendar blocking: owner-unavailable dates + active booking ranges |
| `createBookingRequest` / `transitionBooking` / `submitReview` / `replyToReview` / `raiseDispute` / `resolveDispute` | Booking lifecycle mutations with in-function guards |
| `buildCsv` / `downloadCsv` | RFC-4180 CSV export |

## Entities (types/index.ts)

- **User** — id, name, email, phone, `roles: ("renter"|"owner"|"admin")[]`, `status: "active"|"suspended"`, createdAt. No passwords, anywhere.
- **Car** — id, ownerId, make/model/year, transmission, seats, fuel, city, neighbourhood, `latitude/longitude` (fictional seeded coordinates), pricePerDay (ETB), photos[], description, features[], `status: "draft"|"pending"|"approved"|"rejected"|"inactive"`, `unavailableDates[]` (owner-blocked only), createdAt.
- **Booking** — id, `ref` (`SW-#####`), carId, renterId, ownerId, startDate/endDate/days, **price snapshot**: pricePerDay, subtotal, `fee` (8% platform commission), total; `paymentStatus: "none"|"paid_demo"`, `txnRef` (fake `DEMO-TXN-*`), `status`, createdAt/updatedAt.
- **Review** — bookingId (one review per booking), rating 1–5, comment, optional `ownerReply`.
- **Dispute** — bookingId, openedBy, reason/description, `status: "open"|"resolved"`, resolutionNotes, resolvedBy.
- **Announcement** — title, message, active flag.

## Booking lifecycle

```
requested → confirmed → in_progress → completed → reviewed
    │           │            │            │
    ├─ declined └─ cancelled ├─ disputed ─┴─ disputed → resolved   (admin)
    └─ cancelled             (renter cancels requested/confirmed only)
```

- `requested`, `confirmed`, `in_progress` are **active** — they block the car's calendar (`blockedDates`).
- Overlap is refused at request time **and** re-checked when the owner approves.
- Renter: cancel (requested/confirmed), review (completed → reviewed), dispute (in_progress/completed).
- Owner: approve/decline (requested), start (confirmed), complete (in_progress), reply to reviews.
- Admin: resolve disputes (disputed → resolved) with mandatory notes.

## Seed data

9 users (incl. suspended renter and the only admin), 10 cars across Addis neighbourhoods with mixed moderation statuses (7 approved, 1 pending, 1 inactive, 1 draft), 10 bookings covering every lifecycle status, 2 reviews, 2 disputes (open + resolved), 2 announcements. `initializeDemoData()` seeds only missing keys; a visible "Demo data" label appears in the UI.
