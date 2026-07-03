-- Careos SQLite Relational Schema Definitions
PRAGMA foreign_keys = ON;

-- 1. Users Table (Core Auth lifecycle)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('family', 'nurse', 'admin')),
  is_admin INTEGER DEFAULT 0, -- 0 for false, 1 for true
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Nurses Registry Table (Caregivers clinical profiles)
CREATE TABLE IF NOT EXISTS nurses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  specialties TEXT NOT NULL,
  hourly_rate REAL NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('Weekdays', 'Weekends', '24/7')),
  experience_years INTEGER NOT NULL,
  avatar_url TEXT,
  rating REAL DEFAULT 5.0,
  bio TEXT,
  license_number TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'under_review', 'verified', 'rejected')),
  verification_document_url TEXT,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 3. Bookings Table (Care scheduling lifecycle)
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  nurse_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  hours_per_day INTEGER NOT NULL,
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled', 'completed')),
  has_reviewed INTEGER DEFAULT 0 CHECK (has_reviewed IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (nurse_id) REFERENCES nurses (id) ON DELETE CASCADE
);

-- 4. Reviews Table (Patient testimonials registry)
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  nurse_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (nurse_id) REFERENCES nurses (id) ON DELETE CASCADE
);
