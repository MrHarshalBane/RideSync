const User = require('../models/User');
const Ride = require('../models/Ride');
const { getIsConnected } = require('../config/db');
const { memoryUsers } = require('./authController');
const { memoryRides } = require('./rideController');

const getStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const totalUsers = await User.countDocuments();
      const totalRides = await Ride.countDocuments();
      const activeRides = await Ride.countDocuments({ status: 'active' });
      const completedRides = await Ride.countDocuments({ status: 'completed' });
      
      const rides = await Ride.find();
      const totalDistanceKm = rides.reduce((acc, r) => acc + (r.totalDistanceKm || 0), 0);

      return res.json({
        totalUsers,
        totalRides,
        activeRides,
        completedRides,
        totalDistanceKm: +totalDistanceKm.toFixed(1)
      });
    } else {
      const totalUsers = memoryUsers.length;
      const totalRides = memoryRides.length;
      const activeRides = memoryRides.filter((r) => r.status === 'active').length;
      const completedRides = memoryRides.filter((r) => r.status === 'completed').length;
      const totalDistanceKm = memoryRides.reduce((acc, r) => acc + (r.totalDistanceKm || 0), 0);

      return res.json({
        totalUsers,
        totalRides,
        activeRides,
        completedRides,
        totalDistanceKm: +totalDistanceKm.toFixed(1)
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    } else {
      const users = memoryUsers.map(({ password, ...u }) => u);
      return res.json(users);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users list.' });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (getIsConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      user.isBlocked = !user.isBlocked;
      await user.save();
      return res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`, user });
    } else {
      const user = memoryUsers.find((u) => u._id === userId || u.id === userId);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      user.isBlocked = !user.isBlocked;
      return res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully. (Demo Mode)`, user });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle user block status.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (getIsConnected()) {
      await User.findByIdAndDelete(userId);
      return res.json({ message: 'User deleted successfully.' });
    } else {
      const idx = memoryUsers.findIndex((u) => u._id === userId || u.id === userId);
      if (idx !== -1) {
        memoryUsers.splice(idx, 1);
      }
      return res.json({ message: 'User deleted successfully. (Demo Mode)' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser
};
