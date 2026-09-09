const mongoose = require('mongoose');

const rideLogSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  speed: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  isOffRoute: { type: Boolean, default: false },
  offRouteDistance: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const RideLog = mongoose.model('RideLog', rideLogSchema);

module.exports = RideLog;
