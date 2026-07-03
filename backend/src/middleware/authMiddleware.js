const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'careos-secure-jwt-secret-key-38291';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No authorization header provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, name, is_admin }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.is_admin === 1)) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
};

module.exports = { authMiddleware, adminMiddleware };
