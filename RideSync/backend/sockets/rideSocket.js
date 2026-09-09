const { isOffRoute } = require('../utils/geoUtils');
const { memoryRides } = require('../controllers/rideController');
const Ride = require('../models/Ride');
const { getIsConnected } = require('../config/db');

// Map to track active participant locations in memory for rapid real-time relay
const activeRideLocations = {}; // { rideCode: { userId: { lat, lng, speed, heading, role, name, lastSeen } } }

function initRideSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    // Join Ride Room
    socket.on('join_ride_room', async ({ rideCode, userId, userName, role }) => {
      const room = rideCode.toUpperCase();
      socket.join(room);
      socket.rideCode = room;
      socket.userId = userId;
      socket.userName = userName;
      socket.role = role;

      if (!activeRideLocations[room]) {
        activeRideLocations[room] = {};
      }

      console.log(`👤 ${userName} (${role}) joined ride room: ${room}`);

      // Notify others in room
      socket.to(room).emit('user_joined_ride', {
        userId,
        userName,
        role,
        timestamp: new Date()
      });

      // Send existing active participant locations to newly joined client
      socket.emit('active_participants_snapshot', activeRideLocations[room]);
    });

    // Update Live Location Telemetry
    socket.on('update_location', async (data) => {
      const { rideCode, userId, userName, role, lat, lng, speed = 0, heading = 0, routePolyline = [] } = data;
      const room = (rideCode || socket.rideCode || '').toUpperCase();

      if (!room) return;

      // Off-route checking for followers
      let offRouteStatus = { isOffRoute: false, minDistance: 0 };
      if (role === 'follower' && routePolyline && routePolyline.length > 0) {
        offRouteStatus = isOffRoute({ lat, lng }, routePolyline, 100);
      }

      const participantLocation = {
        userId,
        userName,
        role,
        lat,
        lng,
        speed,
        heading,
        isOffRoute: offRouteStatus.isOffRoute,
        offRouteDistance: offRouteStatus.minDistance,
        lastSeen: new Date()
      };

      if (!activeRideLocations[room]) {
        activeRideLocations[room] = {};
      }
      activeRideLocations[room][userId] = participantLocation;

      // Broadcast location update to room
      io.to(room).emit('location_updated', participantLocation);

      // Trigger dedicated alert if off-route threshold exceeded
      if (offRouteStatus.isOffRoute) {
        io.to(room).emit('off_route_alert', {
          userId,
          userName,
          offRouteDistance: offRouteStatus.minDistance,
          lat,
          lng,
          timestamp: new Date()
        });
      }
    });

    // Send Live Chat Message
    socket.on('send_chat_message', ({ rideCode, text }) => {
      const room = (rideCode || socket.rideCode || '').toUpperCase();
      if (!room) return;

      const messagePayload = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: socket.userId,
        userName: socket.userName || 'Rider',
        role: socket.role,
        text,
        timestamp: new Date()
      };

      io.to(room).emit('new_chat_message', messagePayload);
    });

    // Emergency SOS Trigger
    socket.on('trigger_sos', ({ rideCode, lat, lng }) => {
      const room = (rideCode || socket.rideCode || '').toUpperCase();
      if (!room) return;

      const sosPayload = {
        userId: socket.userId,
        userName: socket.userName,
        lat,
        lng,
        timestamp: new Date()
      };

      io.to(room).emit('sos_emergency_alert', sosPayload);
    });

    // Leave Ride Room
    socket.on('leave_ride_room', ({ rideCode, userId }) => {
      const room = (rideCode || socket.rideCode || '').toUpperCase();
      socket.leave(room);
      if (activeRideLocations[room] && activeRideLocations[room][userId]) {
        delete activeRideLocations[room][userId];
      }

      socket.to(room).emit('user_left_ride', {
        userId,
        userName: socket.userName,
        timestamp: new Date()
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      if (socket.rideCode && socket.userId && activeRideLocations[socket.rideCode]) {
        delete activeRideLocations[socket.rideCode][socket.userId];
        io.to(socket.rideCode).emit('user_left_ride', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });
      }
    });
  });
}

module.exports = initRideSocket;
