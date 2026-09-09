const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rideCode: { type: String, required: true, unique: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaderName: { type: String, required: true },
  sourceName: { type: String, required: true },
  sourceCoords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  destinationName: { type: String, required: true },
  destinationCoords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  routePolyline: [{
    lat: Number,
    lng: Number
  }],
  status: { type: String, enum: ['scheduled', 'active', 'completed'], default: 'active' },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: { type: String, enum: ['leader', 'follower'], default: 'follower' },
    joinedAt: { type: Date, default: Date.now }
  }],
  totalDistanceKm: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
