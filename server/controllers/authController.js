import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper — creates a token with the user's ID inside
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, college, year } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user — password gets hashed automatically by the pre-save hook
    const user = await User.create({ name, email, password, college, year });

    res.status(201).json({
      token: signToken(user._id),
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        college: user.college,
        year:    user.year
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check user exists AND password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user._id),
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        college: user.college,
        year:    user.year
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  try {
    // req.user.id was set by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};