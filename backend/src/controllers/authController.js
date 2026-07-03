const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbQuery } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'careos-secure-jwt-secret-key-38291';

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
  }

  // Map roles if patient or doctor comes from frontend
  let dbRole = role.toLowerCase();
  if (dbRole === 'patient' || dbRole === 'doctor') {
    dbRole = 'family';
  }

  if (!['family', 'nurse', 'admin'].includes(dbRole)) {
    return res.status(400).json({ error: 'Invalid user role specified.' });
  }

  try {
    // 1. Check if user already exists
    const existingUser = await dbQuery.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const isAdmin = dbRole === 'admin' ? 1 : 0;

    // 3. Insert user into users table
    const result = await dbQuery.run(
      'INSERT INTO users (name, email, password_hash, role, is_admin) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), passwordHash, dbRole, isAdmin]
    );
    const userId = result.lastID;

    // 4. If user is a nurse, insert empty clinical profile row to ensure get/put profile doesn't 404
    if (dbRole === 'nurse') {
      await dbQuery.run(
        `INSERT INTO nurses (user_id, specialties, hourly_rate, availability, experience_years, avatar_url, rating, bio, license_number, verification_status) 
         VALUES (?, '', 25.0, 'Weekdays', 1, '', 5.0, '', '', 'pending')`,
        [userId]
      );
    }

    // 5. Sign JWT
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), role: dbRole, name, is_admin: isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase(),
        role: dbRole,
        is_admin: isAdmin
      }
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // 1. Fetch user by email
    const user = await dbQuery.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await dbQuery.get('SELECT id, name, email, role, is_admin, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error('❌ Fetch current user error:', err);
    return res.status(500).json({ error: 'Internal server error fetching user.' });
  }
};
