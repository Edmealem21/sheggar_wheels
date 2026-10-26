# Sheggar Wheels - Peer-to-Peer Car Rental Platform

Sheggar Wheels is a responsive, frontend-only peer-to-peer car rental marketplace for Addis Ababa. Car owners can publish vehicles, set rental prices, and manage booking requests. Customers can browse vehicles, request rentals, and leave reviews after completed trips. Administrators can moderate listings, manage users, and inspect platform activity.

## Features
*   **Role-Aware Dashboards**: Distinct views for Renters, Owners, and Admins.
*   **Car Catalogue**: Search, filter by location/price/transmission, and view detailed car pages.
*   **Booking Lifecycle**: Complete state management from `requested` to `completed` or `cancelled`.
*   **Mock Checkout**: A simulated TeleBirr payment gateway that creates a booking request.
*   **Interactive Map**: Leaflet map integration for tracking trip locations.
*   **Data Persistence**: Uses browser `localStorage` and `sessionStorage` to simulate a database.
*   **Responsive UI**: Fully responsive layout with a collapsible mobile sidebar.

## Tech Stack
*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Maps**: React-Leaflet
*   **Language**: TypeScript

## Getting Started

### Prerequisites
Make sure you have Node.js installed (v18 or higher).

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>