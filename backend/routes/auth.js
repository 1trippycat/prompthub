import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { APIError } from '../middleware/error.js';
import authConfig from '../config/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Google OAuth login
router.post('/google', authMiddleware.verifyGoogleToken, async (req, res, next) => {
  try {
    const { googleId, email, name, picture } = req.user;

    // Find or create user
    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = authConfig.generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Set cookie
    res.cookie('token', token, authConfig.cookieOptions);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authMiddleware.verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      throw new APIError(404, 'User not found');
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Update user settings
router.patch('/settings', authMiddleware.verifyToken, async (req, res, next) => {
  try {
    const allowedSettings = ['defaultLLMProvider', 'theme', 'promptsPerPage'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedSettings.includes(key)) {
        updates[`settings.${key}`] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Check auth status
router.get('/check', authMiddleware.verifyToken, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { authenticated: true }
  });
});

export default router;