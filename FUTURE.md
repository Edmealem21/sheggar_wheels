# Future Work & Limitations

Because this project is a frontend-only capstone, several features are simulated or missing. If this were to move to production, the following steps are prioritized:

## 1. Backend & Database
*   **Remove `localStorage`:** Move all data to a real database (e.g., PostgreSQL via Prisma) and a secure API.
*   **Server-Side Authorization:** Move ownership checks (e.g., `booking.ownerId === user.id`) from the client to the server. Never trust the client.

## 2. Security
*   **Real Authentication:** Implement password hashing (bcrypt), JWT tokens, and HTTP-only cookies instead of a mock session ID.
*   **Validation:** Add Zod or Yup validation on the server to ensure data integrity.

## 3. Payments
*   **Real TeleBirr Integration:** Replace the mock checkout with a real payment gateway. This requires a secure backend to handle webhooks and secrets.

## 4. File Uploads
*   **Image Uploading:** Currently, cars use URL strings. A production app needs an integration with a cloud provider like AWS S3 or Cloudinary to handle real image uploads.

## 5. Real-Time Features
*   **WebSockets:** Implement real-time notifications for booking requests and chat between owners and renters, replacing the current simulated state updates.