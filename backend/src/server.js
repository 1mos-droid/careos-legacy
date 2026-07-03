const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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

// Wrap express server in http server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io with permissive CORS for local demo environments
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }
});

// Socket.io connection listener
io.on('connection', (socket) => {
  console.log(`🔌 Real-time WebSocket connection established: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 WebSocket connection closed: ${socket.id}`);
  });
});

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

// Attach io to requests so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

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

// Start Server after database is connected and seeded
connectPromise.then(() => {
  server.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Careos API & Real-time Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================\n`);
  });
}).catch(err => {
  console.error("❌ Failed to start server due to database connection issue:", err);
});
