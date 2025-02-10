import { APIError } from './error.js';
import authConfig from '../config/auth.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(authConfig.google.clientId);

const authMiddleware = {
  // Verify JWT token
  verifyToken: async (req, res, next) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new APIError(401, 'Please log in to access this resource');
      }

      const decoded = authConfig.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(new APIError(401, 'Invalid or expired token'));
    }
  },

  // Verify Google OAuth token
  verifyGoogleToken: async (req, res, next) => {
    try {
      const { token } = req.body;
      if (!token) {
        throw new APIError(401, 'Google token is required');
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: authConfig.google.clientId
      });

      const payload = ticket.getPayload();
      req.user = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
      next();
    } catch (error) {
      next(new APIError(401, 'Invalid Google token'));
    }
  },

  // Check user role
  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new APIError(403, 'You do not have permission to perform this action'));
      }
      next();
    };
  },

  // Rate limiting middleware
  rateLimiter: {
    windowMs: authConfig.rateLimit.windowMs,
    max: authConfig.rateLimit.max,
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res) => {
      throw new APIError(429, 'Too many requests from this IP, please try again later');
    }
  },

  // CORS configuration middleware
  cors: (req, res, next) => {
    res.header('Access-Control-Allow-Origin', authConfig.cors.origin);
    res.header('Access-Control-Allow-Methods', authConfig.cors.methods.join(', '));
    res.header('Access-Control-Allow-Headers', authConfig.cors.allowedHeaders.join(', '));
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  },

  // Check if user owns the resource
  checkOwnership: (Model) => async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) {
        return next(new APIError(404, 'Document not found'));
      }
      
      if (doc.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new APIError(403, 'You do not have permission to perform this action'));
      }
      
      req.doc = doc;
      next();
    } catch (error) {
      next(error);
    }
  }
};

export default authMiddleware;