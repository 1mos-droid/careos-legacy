# Careos (Elderly Care Nurse Finder & Booking Platform)

Careos is a completely localized full-stack MVP designed to help families find, evaluate, and book qualified nurses for in-home elderly care.

## Project Structure

This project is organized as a monorepo:
* **`/backend`**: Node.js & Express.js REST API using SQLite as a local, file-based database, with local JWT/bcrypt-based authentication.
* **`/frontend`**: React frontend built with Vite, using vanilla CSS for premium styling.
* **`DEVELOPMENT.md`**: Refer directly to [DEVELOPMENT.md](DEVELOPMENT.md) for full engineering specifications, database schemas, API endpoint details, styling guidelines, and deployment details.

---

## Local Development Setup & Run Instructions

To make running both applications as convenient as possible, we use a root-level script configuration.

### Prerequisites

* **Node.js** (v16.x or newer)
* **npm** (v7.x or newer)

### Quick Start (All-in-one execution)

1. Clone or navigate to the repository directory.
2. In the root directory, install all required dependencies (root, backend, and frontend):
   ```bash
   npm run setup
   ```
3. Boot up both the Express backend and Vite frontend concurrently with a single command:
   ```bash
   npm run dev
   ```

The application will be accessible at:
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)

---

## Technical Details

### Backend Features (Express & SQLite)
* **Database**: Local SQLite database storing `users`, `nurses`, and `bookings` tables inside `backend/database.sqlite` (auto-created and seeded on first launch).
* **Security & Auth**: Local username/password authentication using `bcryptjs` for security and JSON Web Tokens (JWT) for route authorization.
* **Seed Data**: Populated with 3 highly detailed dummy nurses specializing in Dementia, Physical Therapy, and General Elder Care, along with 1 test family account.

### Frontend Features (React & Vite)
* **Aesthetics**: Custom-crafted dark/light theme, modern typography, grid discovery UI, interactive booking calendars, and glassmorphic micro-animations.
* **Authentication**: Seamless local session persistence using client-side JWT storage.
* **Filters**: Dynamic search panel enabling range filters on hourly rates, specialty checkboxes, and minimum availability requirements.
