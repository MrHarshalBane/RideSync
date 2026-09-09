const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/block', toggleBlockUser);
router.delete('/users/:userId', deleteUser);

module.exports = router;
