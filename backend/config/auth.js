import jwt from 'jsonwebtoken';

const authConfig = {
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
    algorithm: 'HS256'
  },

  // Google OAuth configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
  },

  // Generate JWT token
  generateToken: (payload) => {
    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
      algorithm: authConfig.jwt.algorithm
    });
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (err) {
      throw new Error('Invalid token');
    }
  },

  // Cookie options
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },

  // Password hashing configuration (if needed)
  hash: {
    saltRounds: 10
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },

  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

export default authConfig;