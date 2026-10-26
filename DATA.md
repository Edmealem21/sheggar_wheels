# Data Layer & LocalStorage

The application acts as a database using the browser's `localStorage`. 

## Storage Keys
| Key | Contents |
| :--- | :--- |
| `sw_users_v1` | Array of User objects (id, name, email, roles, status). |
| `sw_cars_v1` | Array of Car objects (id, ownerId, make, model, price, status). |
| `sw_bookings_v1` | Array of Booking objects (id, carId, renterId, dates, status). |
| `sw_reviews_v1` | Array of Review objects (id, bookingId, rating, comment). |
| `sw_session_v1` | String (User ID). Stored in `sessionStorage`, not local. |

## Helper Functions (`lib/storage.ts`)
*   `readStorage<T>(key, fallback)`: Wraps `JSON.parse` in a `try/catch` block. If the JSON is malformed or missing, it returns the safe fallback value instead of crashing the app.
*   `writeStorage<T>(key, value)`: Wraps `JSON.stringify` in a `try/catch` to handle storage quota errors.

## Recovery Behavior
*   If `sw_cars_v1` is deleted or cleared, the `seedData()` function will automatically regenerate demo data upon page load.
*   The `seedData()` function checks for the existence of specific demo user IDs. If a user manually deletes the admin, the app will reset the seed data to ensure the demo remains functional.