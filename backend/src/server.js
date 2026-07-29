const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Initialize DB immediately
const { db, connectPromise } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Standard Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for local development styling flexibility
}));
app.use(morgan('dev')); // Request logging
app.use(cors({
  origin: '*', // For local development flexibility
  credentials: true
}));
app.use(express.json());

// Routes Mounts
const authRoutes = require('./routes/auth');
const nurseRoutes = require('./routes/nurses');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/nurses', nurseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error.';
  
  if (status === 500) {
    console.error('💥 Unhandled Server Exception:', err);
  }
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ponytail: Socket.io real-time server wrapper removed as YAGNI (no controllers or client features use websockets).
// If real-time notifications are requested, we can re-add it or use lightweight Server-Sent Events (SSE).
connectPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Careos API Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================\n`);
  });
}).catch(err => {
  console.error("❌ Failed to start server due to database connection issue:", err);
});
