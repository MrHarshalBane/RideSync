const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const adminRoutes = require('./routes/adminRoutes');
const initRideSocket = require('./sockets/rideSocket');

const app = express();
const server = http.createServer(app);

// Enable Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection
connectDB();

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'RideSync - Real-Time Biker Group Ride Tracking System',
    timestamp: new Date()
  });
});

// Initialize Socket.IO Handler
initRideSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 RideSync Server running on port ${PORT}`);
  console.log(`📡 Socket.IO Real-Time Engine Active`);
});
