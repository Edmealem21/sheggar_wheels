# AUTH — Demo Session, Guards & Negative Tests

> **Frontend checks are not production security.** This demo's "session" is a user id in `sessionStorage` and all records live in user-editable `localStorage`. Anyone can bypass every guard with browser devtools. The guards exist to demonstrate correct *application logic*, not to provide real security. A production version needs a real backend with server-side sessions, hashed credentials and authorization enforced on the server.

## Session model

- `signInAsDemo(userId)` writes `{ userId, signedInAt }` to `sessionStorage["sw_session_v1"]`. No passwords are stored or requested anywhere.
- `getCurrentUser()` resolves the session against the users collection; unknown ids yield `null`.
- `signOut()` removes the session **and** the checkout draft.
- Accounts have a `status`: `active` or `suspended`. Suspended accounts can look but every mutation is refused.
- Roles: `renter`, `owner`, `admin`. One account may hold renter + owner (demo: Dawit). The **admin role exists only on the seeded admin account** — signup always creates renter-only accounts and there is no UI to grant roles.

## Guard layers

1. **Layout guards** — `DashShell` (client) waits for the store, then: no session → `Denied` with a sign-in link carrying `?next=<current path>`; suspended account → blocked notice; missing role → `Denied`. `/checkout` is guarded by its own client component (needs session **and** a checkout draft).
2. **Rule guards** — every mutation in `lib/bookings.ts` / `lib/actions.ts` re-checks, inside the function: session user present → account active → required role/capability → ownership of the car/booking → validity of the status transition. Failed checks return `{ ok: false, error }` and write nothing.
3. **Redirect safety** — `safeReturnPath()` only allows internal absolute paths (`/dashboard`) and rejects external (`https://…`) and protocol-relative (`//…`) URLs. Used by the sign-in page for its `next` parameter.

## The three required negative tests

All three are automated in `tests/business-rules.test.ts` and pass:

| # | Scenario | Expected result | Where |
|---|---|---|---|
| N1 | Booking without a session | `createBookingRequest(null, …)` → refused, nothing written | `N1: booking without a session` |
| N2 | Cancelling another renter's booking | `transitionBooking(otherUser, bookingId, "cancel")` → refused, status unchanged | `N2: cross-user actions are refused` |
| N3 | `/signin?next=https://example.com` | `safeReturnPath` returns `/` — redirect goes only to a safe internal path | `N3: safeReturnPath only allows internal paths` |

Additional automated negative coverage: suspended account blocked, non-owner approval refused, invalid transitions refused, booking your own car refused, non-approved car refused, overlapping approvals refused, duplicate review refused, non-admin dispute resolution refused, unrelated-user dispute refused, unknown sign-in refused, malformed JSON recovered.

## Payments

The checkout is a **mock TeleBirr flow**: the button says "Complete demo payment", no card/mobile credentials are ever requested, and the booking is stored with `paymentStatus: "paid_demo"` plus a fake `DEMO-TXN-*` reference shown on the receipt.
