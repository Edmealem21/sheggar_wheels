# FUTURE — From Demo to Production

Ordered roughly by priority.

## Backend & real security

1. **Real backend** — replace the `lib/storage.ts` data layer with a database (e.g. PostgreSQL) behind server actions / route handlers. The business-rule functions in `lib/bookings.ts` / `lib/actions.ts` are already shaped for this (`{ ok, data | error }`, guards inside every mutation) — move them server-side and keep the signatures.
2. **Real authentication** — email/phone + OTP or OAuth, hashed credentials, server-side sessions. Keep the rule that admin is never publicly assignable; add an owner-application flow instead of self-serving owner roles.
3. **Server-enforced authorization** — re-run every guard (ownership, role, transition validity) on the server; the current client guards are UX, not security.

## Payments

4. **Real TeleBirr / Chapa integration** — server-side payment intent, webhook confirmation, idempotency keys, refunds on cancellation. The mock already snapshots price + 8% fee and stores a transaction reference, which maps onto a real payment record.
5. **Owner payouts & commission ledger** — the mock commission report becomes a real payout schedule.

## Product depth

6. **Real availability & pricing** — calendar sync (iCal), seasonal pricing, deposits, mileage limits.
7. **Verification & trust** — ID/driving-licence checks, car document upload and moderation, two-sided reviews, damage reports with photos.
8. **Messaging** — renter ↔ owner chat per booking; notifications become persisted records (they are currently derived on the fly) with email/SMS delivery.
9. **Real maps** — geocoded addresses, pickup-point selection, real trip tracking with consent (replacing the clearly-labelled simulation).
10. **Disputes workflow** — evidence uploads, status timeline, owner responses (currently a demo acknowledgement), admin decision templates.

## Engineering

11. **E2E tests** — Playwright across the three journeys (book a car, approve a request, resolve a dispute). The current vitest suite covers business rules only.
12. **i18n** — Amharic alongside English; ETB formatting via `Intl`.
13. **Observability** — error reporting, analytics, audit log for admin actions.
14. **Image pipeline** — owner photo uploads to object storage with moderation, replacing the demo photo pool / hot-linked seeds.
