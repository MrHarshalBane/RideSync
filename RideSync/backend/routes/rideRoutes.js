const express = require('express');
const router = express.Router();
const {
  createRide,
  joinRide,
  getRideByCode,
  getUserRideHistory,
  endRide
} = require('../controllers/rideController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, createRide);
router.post('/join', authMiddleware, joinRide);
router.get('/history', authMiddleware, getUserRideHistory);
router.get('/code/:code', authMiddleware, getRideByCode);
router.post('/end/:rideId', authMiddleware, endRide);

module.exports = router;
