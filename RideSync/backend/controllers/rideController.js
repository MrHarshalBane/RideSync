const Ride = require('../models/Ride');
const { getIsConnected } = require('../config/db');
const { generateRideCode } = require('../utils/codeGenerator');
const { calculateDistanceMeters } = require('../utils/geoUtils');

// In-Memory Rides Store for Fallback Demo
const memoryRides = [
  {
    _id: 'ride_demo_101',
    title: 'Western Express Highway Sunrise Rally',
    rideCode: 'RS-DEMO1',
    leader: 'user_leader_1',
    leaderName: 'Harshal Sane (Leader)',
    sourceName: 'Bandra Reclamation, Mumbai',
    sourceCoords: { lat: 19.0434, lng: 72.8223 },
    destinationName: 'Gorai Beach, Borivali',
    destinationCoords: { lat: 19.2458, lng: 72.7812 },
    routePolyline: [
      { lat: 19.0434, lng: 72.8223 },
      { lat: 19.0968, lng: 72.8516 },
      { lat: 19.1412, lng: 72.8465 },
      { lat: 19.1985, lng: 72.8488 },
      { lat: 19.2458, lng: 72.7812 }
    ],
    status: 'active',
    participants: [
      { userId: 'user_leader_1', name: 'Harshal Sane (Leader)', role: 'leader', joinedAt: new Date() },
      { userId: 'user_follower_1', name: 'Alex Rider (Follower)', role: 'follower', joinedAt: new Date() }
    ],
    totalDistanceKm: 28.5,
    startTime: new Date(Date.now() - 3600000),
    createdAt: new Date()
  }
];

// Helper to compute polyline total distance
function computePolylineDistanceKm(polyline) {
  if (!polyline || polyline.length < 2) return 0;
  let totalMeters = 0;
  for (let i = 0; i < polyline.length - 1; i++) {
    totalMeters += calculateDistanceMeters(
      polyline[i].lat,
      polyline[i].lng,
      polyline[i + 1].lat,
      polyline[i + 1].lng
    );
  }
  return +(totalMeters / 1000).toFixed(2);
}

const createRide = async (req, res) => {
  try {
    const { title, sourceName, sourceCoords, destinationName, destinationCoords, routePolyline } = req.body;
    if (!title || !sourceName || !sourceCoords || !destinationName || !destinationCoords) {
      return res.status(400).json({ message: 'Missing required ride parameters.' });
    }

    const rideCode = generateRideCode();
    const leaderId = req.user.id;
    const leaderName = req.user.name;

    const polyline = routePolyline && routePolyline.length > 0 ? routePolyline : [sourceCoords, destinationCoords];
    const totalDistanceKm = computePolylineDistanceKm(polyline);

    if (getIsConnected()) {
      const newRide = new Ride({
        title,
        rideCode,
        leader: leaderId,
        leaderName,
        sourceName,
        sourceCoords,
        destinationName,
        destinationCoords,
        routePolyline: polyline,
        status: 'active',
        participants: [{ userId: leaderId, name: leaderName, role: 'leader', joinedAt: new Date() }],
        totalDistanceKm,
        startTime: new Date()
      });

      await newRide.save();
      return res.status(201).json({ message: 'Ride created successfully!', ride: newRide });
    } else {
      const newRide = {
        _id: `ride_${Date.now()}`,
        title,
        rideCode,
        leader: leaderId,
        leaderName,
        sourceName,
        sourceCoords,
        destinationName,
        destinationCoords,
        routePolyline: polyline,
        status: 'active',
        participants: [{ userId: leaderId, name: leaderName, role: 'leader', joinedAt: new Date() }],
        totalDistanceKm,
        startTime: new Date(),
        createdAt: new Date()
      };

      memoryRides.unshift(newRide);
      return res.status(201).json({ message: 'Ride created successfully! (Demo Mode)', ride: newRide });
    }
  } catch (err) {
    console.error('Create Ride Error:', err);
    res.status(500).json({ message: 'Server error while creating ride.' });
  }
};

const joinRide = async (req, res) => {
  try {
    const { rideCode } = req.body;
    if (!rideCode) {
      return res.status(400).json({ message: 'Ride Code is required.' });
    }

    const normalizedCode = rideCode.trim().toUpperCase();
    const userId = req.user.id;
    const userName = req.user.name;

    if (getIsConnected()) {
      const ride = await Ride.findOne({ rideCode: normalizedCode });
      if (!ride) {
        return res.status(404).json({ message: 'Ride Code not found. Please check and try again.' });
      }

      if (ride.status === 'completed') {
        return res.status(400).json({ message: 'This ride has already ended.' });
      }

      const existingParticipant = ride.participants.find((p) => p.userId.toString() === userId);
      if (!existingParticipant) {
        ride.participants.push({ userId, name: userName, role: 'follower', joinedAt: new Date() });
        await ride.save();
      }

      return res.json({ message: 'Successfully joined ride session!', ride });
    } else {
      const ride = memoryRides.find((r) => r.rideCode.toUpperCase() === normalizedCode);
      if (!ride) {
        return res.status(404).json({ message: 'Ride Code not found. Please check and try again.' });
      }

      if (ride.status === 'completed') {
        return res.status(400).json({ message: 'This ride has already ended.' });
      }

      const existingParticipant = ride.participants.find((p) => p.userId === userId);
      if (!existingParticipant) {
        ride.participants.push({ userId, name: userName, role: 'follower', joinedAt: new Date() });
      }

      return res.json({ message: 'Successfully joined ride session! (Demo Mode)', ride });
    }
  } catch (err) {
    console.error('Join Ride Error:', err);
    res.status(500).json({ message: 'Server error while joining ride.' });
  }
};

const getRideByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const normalizedCode = code.trim().toUpperCase();

    let ride;
    if (getIsConnected()) {
      ride = await Ride.findOne({ rideCode: normalizedCode });
    } else {
      ride = memoryRides.find((r) => r.rideCode.toUpperCase() === normalizedCode);
    }

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ride details.' });
  }
};

const getUserRideHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      const rides = await Ride.find({
        'participants.userId': userId
      }).sort({ createdAt: -1 });
      return res.json(rides);
    } else {
      const userRides = memoryRides.filter((r) =>
        r.participants.some((p) => p.userId === userId || p.userId.toString() === userId)
      );
      return res.json(userRides);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ride history.' });
  }
};

const endRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (getIsConnected()) {
      const ride = await Ride.findById(rideId);
      if (!ride) return res.status(404).json({ message: 'Ride not found.' });

      if (ride.leader.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only the ride leader can end the ride.' });
      }

      ride.status = 'completed';
      ride.endTime = new Date();
      await ride.save();

      return res.json({ message: 'Ride ended successfully.', ride });
    } else {
      const ride = memoryRides.find((r) => r._id === rideId);
      if (!ride) return res.status(404).json({ message: 'Ride not found.' });

      if (ride.leader !== req.user.id && ride.leader._id !== req.user.id) {
        return res.status(403).json({ message: 'Only the ride leader can end the ride.' });
      }

      ride.status = 'completed';
      ride.endTime = new Date();

      return res.json({ message: 'Ride ended successfully. (Demo Mode)', ride });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error ending ride.' });
  }
};

module.exports = {
  createRide,
  joinRide,
  getRideByCode,
  getUserRideHistory,
  endRide,
  memoryRides
};
