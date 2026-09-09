const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'ridesync_super_secret_jwt_token_key_2026';

// In-Memory Fallback Users Store for instant zero-config demo
const memoryUsers = [
  {
    _id: 'user_admin_1',
    name: 'Admin Harshal',
    email: 'admin@ridesync.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    isBlocked: false,
    createdAt: new Date()
  },
  {
    _id: 'user_leader_1',
    name: 'Harshal Sane (Leader)',
    email: 'harshal@ridesync.com',
    password: bcrypt.hashSync('rider123', 10),
    role: 'rider',
    isBlocked: false,
    createdAt: new Date()
  },
  {
    _id: 'user_follower_1',
    name: 'Alex Rider (Follower)',
    email: 'alex@ridesync.com',
    password: bcrypt.hashSync('rider123', 10),
    role: 'rider',
    isBlocked: false,
    createdAt: new Date()
  }
];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'rider';

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: assignedRole
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Registration successful!',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } else {
      // In-Memory Mode
      const existing = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
        isBlocked: false,
        createdAt: new Date()
      };
      memoryUsers.push(newUser);

      const token = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Registration successful! (Demo Mode)',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let user;
    if (getIsConnected()) {
      user = await User.findOne({ email });
    } else {
      user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked by administrator. Contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const userId = user._id || user.id;
    const token = jwt.sign(
      { id: userId, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: userId, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let user;
    if (getIsConnected()) {
      user = await User.findById(userId).select('-password');
    } else {
      user = memoryUsers.find((u) => u._id === userId || u.id === userId);
      if (user) {
        const { password, ...rest } = user;
        user = rest;
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  memoryUsers
};
