# Authentication & Security Guards

**IMPORTANT:** This application implements *frontend demonstration* guardrails only. It does not use a real backend, passwords, or secure tokens. The checks below prevent normal UI misuse, but a user can easily bypass them using browser developer tools.

## Session Management
*   Authentication is mocked. Clicking "Demo Renter" stores a user ID in `sessionStorage` (key: `sw_session_v1`).
*   On sign-out, this key is removed, and the user is redirected to `/`.

## Role & Ownership Checks
Before mutating data, the frontend checks:
1.  **Session Existence:** Is there a user ID in `sessionStorage`?
2.  **Role Check:** Does the user's role array contain "owner" or "admin"?
3.  **Ownership Check:** (e.g., Does `booking.ownerId === currentUser.id` before allowing an owner to approve a booking?)

## Safe Return Path (`?next=`)
When a signed-out user tries to book a car, they are sent to `/signin?next=/checkout`.
*   After login, the `signInAsDemo` function reads the `next` parameter.
*   It validates that the URL starts with `/` (internal) and **not** `//` (external). This prevents Open Redirect attacks.

## Required Negative Tests
1.  **Signed-out write attempt:** Visiting `/checkout` without a session immediately redirects to `/signin`.
2.  **Cross-user ownership:** An owner cannot edit a car they do not own (the UI hides the button, and the logic checks `ownerId`).
3.  **Unsafe return URL:** Visiting `/signin?next=https://evil.com` will ignore the `next` param and redirect to the default `/dashboard`.