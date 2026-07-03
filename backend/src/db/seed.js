const bcrypt = require('bcryptjs');

async function seedDatabase() {
  const { dbQuery } = require('../config/db');

  try {
    console.log("🌱 Starting SQLite database seeding check...");

    // Check if users already exist
    const userCount = await dbQuery.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) {
      console.log("✅ Database already has records. Skipping seeding.");
      return;
    }

    console.log("  -> Database is empty. Seeding initial records...");

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Core Users
    // Insert Family 1 (Jane Smith)
    const resFamily1 = await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'family', 0)",
      ['Jane Smith', 'jane@example.com', passwordHash]
    );
    const family1Id = resFamily1.lastID;

    // Insert Family 2 (Moses)
    const resFamily2 = await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'family', 0)",
      ['Moses', 'moses@example.com', passwordHash]
    );

    // Insert Nurse 1 (Sarah Jenkins)
    const resNurse1 = await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'nurse', 0)",
      ['Sarah Jenkins, RN', 'sarah@example.com', passwordHash]
    );
    const nurse1UserId = resNurse1.lastID;

    // Insert Nurse 2 (Michael Chang)
    const resNurse2 = await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'nurse', 0)",
      ['Michael Chang, LPN', 'michael@example.com', passwordHash]
    );
    const nurse2UserId = resNurse2.lastID;

    // Insert Nurse 3 (Elena Rostova)
    const resNurse3 = await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'nurse', 0)",
      ['Elena Rostova, RN', 'elena@example.com', passwordHash]
    );
    const nurse3UserId = resNurse3.lastID;

    // Insert Nurse 4 (James Carter) - Pending verification
    const resNurse4 = await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'nurse', 0)",
      ['James Carter', 'james@example.com', passwordHash]
    );
    const nurse4UserId = resNurse4.lastID;

    // Insert Admin
    await dbQuery.run(
      "INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, 'admin', 1)",
      ['Careos System Admin', 'admin@example.com', passwordHash]
    );

    console.log("  ✅ Users inserted. Seeding caregiver profiles...");

    // 2. Create Nurse Profiles
    // Nurse 1: Sarah Jenkins (Verified)
    const resProf1 = await dbQuery.run(
      `INSERT INTO nurses (user_id, specialties, hourly_rate, availability, experience_years, avatar_url, rating, bio, license_number, verification_status) 
       VALUES (?, 'Dementia Care, Medication Management, Chronic Care', 45.0, 'Weekdays', 8, 
       'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300', 
       4.9, 'Dedicated Registered Nurse with 8 years of experience in geriatric home care and dementia management.', 'RN-998822', 'verified')`,
      [nurse1UserId]
    );
    const nurse1Id = resProf1.lastID;

    // Nurse 2: Michael Chang (Verified)
    const resProf2 = await dbQuery.run(
      `INSERT INTO nurses (user_id, specialties, hourly_rate, availability, experience_years, avatar_url, rating, bio, license_number, verification_status) 
       VALUES (?, 'Physical Therapy assistance, Post-Stroke Rehab, Mobility support', 55.0, 'Weekends', 12, 
       'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', 
       4.8, 'Licensed Practical Nurse specializing in post-stroke physical recovery and mobility support transfers.', 'LPN-112233', 'verified')`,
      [nurse2UserId]
    );
    const nurse2Id = resProf2.lastID;

    // Nurse 3: Elena Rostova (Verified)
    const resProf3 = await dbQuery.run(
      `INSERT INTO nurses (user_id, specialties, hourly_rate, availability, experience_years, avatar_url, rating, bio, license_number, verification_status) 
       VALUES (?, 'Palliative Care, IV Therapy, Pain Management', 65.0, '24/7', 15, 
       'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300', 
       5.0, 'Compassionate RN with 15 years in end-of-life care, acute pain management, and home IV infusions.', 'RN-776655', 'verified')`,
      [nurse3UserId]
    );
    const nurse3Id = resProf3.lastID;

    // Nurse 4: James Carter (Under Review)
    await dbQuery.run(
      `INSERT INTO nurses (user_id, specialties, hourly_rate, availability, experience_years, avatar_url, rating, bio, license_number, verification_status, verification_document_url) 
       VALUES (?, 'Dementia Care, General Elder Care', 30.0, 'Weekdays', 1, 
       'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300', 
       5.0, 'Passionate recent nursing graduate looking to support senior patients in daily tasks and companionship.', 'RN-009911', 'under_review', 'https://careos-documents.s3.amazonaws.com/proofs/james_carter_license.pdf')`,
      [nurse4UserId]
    );

    console.log("  ✅ Nurse profiles created. Seeding initial bookings...");

    // 3. Create Bookings & Reviews
    // Booking 1: Family 1 books Nurse 1 (Completed)
    const resBook1 = await dbQuery.run(
      `INSERT INTO bookings (user_id, nurse_id, start_date, end_date, hours_per_day, total_price, status, has_reviewed) 
       VALUES (?, ?, '2026-05-10', '2026-05-14', 8, 1440.0, 'completed', 1)`,
      [family1Id, nurse1Id]
    );
    const booking1Id = resBook1.lastID;

    // Booking 2: Family 1 books Nurse 3 (Completed)
    const resBook2 = await dbQuery.run(
      `INSERT INTO bookings (user_id, nurse_id, start_date, end_date, hours_per_day, total_price, status, has_reviewed) 
       VALUES (?, ?, '2026-05-01', '2026-05-03', 12, 2340.0, 'completed', 1)`,
      [family1Id, nurse3Id]
    );
    const booking2Id = resBook2.lastID;

    console.log("  ✅ Bookings created. Seeding reviews...");

    // 4. Create Reviews
    // Review for Nurse 1 (Sarah Jenkins)
    await dbQuery.run(
      `INSERT INTO reviews (booking_id, user_id, nurse_id, rating, comment) 
       VALUES (?, ?, ?, 5, 'Sarah was absolutely outstanding. Her clinical attention and medication management kept my father safe and happy during recovery.')`,
      [booking1Id, family1Id, nurse1Id]
    );

    // Review for Nurse 3 (Elena Rostova)
    await dbQuery.run(
      `INSERT INTO reviews (booking_id, user_id, nurse_id, rating, comment) 
       VALUES (?, ?, ?, 5, 'Elena provided exceptional care. She is extremely knowledgeable and possesses a gentle touch that made a huge difference.')`,
      [booking2Id, family1Id, nurse3Id]
    );

    console.log("✅ SQLite Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding database failed:", err.message);
  }
}

module.exports = { seedDatabase };
