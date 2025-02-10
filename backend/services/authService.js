import { OAuth2Client } from 'google-auth-library';
import authConfig from '../config/auth.js';
import User from '../models/User.js';
import { APIError } from '../middleware/error.js';

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(authConfig.google.clientId);
  }

  async verifyGoogleToken(token) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: authConfig.google.clientId
      });

      const payload = ticket.getPayload();
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
    } catch (error) {
      throw new APIError(401, 'Invalid Google token');
    }
  }

  async findOrCreateUser(userData) {
    try {
      let user = await User.findOne({ googleId: userData.googleId });

      if (!user) {
        user = await User.create(userData);
      }

      await user.updateLastLogin();
      return user;
    } catch (error) {
      throw new APIError(500, 'Error creating/finding user');
    }
  }

  generateAuthResponse(user) {
    const token = authConfig.generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return {
      user,
      token,
      cookieOptions: authConfig.cookieOptions
    };
  }

  async updateUserSettings(userId, settings) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { settings } },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new APIError(404, 'User not found');
      }

      return user;
    } catch (error) {
      throw new APIError(500, 'Error updating user settings');
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-__v');
      
      if (!user) {
        throw new APIError(404, 'User not found');
      }

      return user;
    } catch (error) {
      throw new APIError(500, 'Error fetching user');
    }
  }

  verifyToken(token) {
    try {
      return authConfig.verifyToken(token);
    } catch (error) {
      throw new APIError(401, 'Invalid or expired token');
    }
  }
}

export default new AuthService();