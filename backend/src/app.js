import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';

// Import routes
import authRoutes from '../routes/auth.js';
import promptRoutes from '../routes/prompts.js';
import llmRoutes from '../routes/llm.js';

// Import middleware
import { errorHandler, notFound } from '../middleware/error.js';
import authMiddleware from '../middleware/auth.js';

// Import configs
import authConfig from '../config/auth.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(authMiddleware.cors);

// Rate limiting
const limiter = rateLimit(authMiddleware.rateLimiter);
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/llm', llmRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      version: '1.0.0',
      baseUrl: '/api',
      endpoints: {
        auth: {
          base: '/auth',
          routes: [
            { path: '/google', method: 'POST', description: 'Google OAuth login' },
            { path: '/me', method: 'GET', description: 'Get current user' },
            { path: '/settings', method: 'PATCH', description: 'Update user settings' },
            { path: '/logout', method: 'POST', description: 'Logout user' }
          ]
        },
        prompts: {
          base: '/prompts',
          routes: [
            { path: '/', method: 'GET', description: 'Get all prompts' },
            { path: '/', method: 'POST', description: 'Create new prompt' },
            { path: '/:id', method: 'GET', description: 'Get prompt by ID' },
            { path: '/:id', method: 'PATCH', description: 'Update prompt' },
            { path: '/:id', method: 'DELETE', description: 'Delete prompt' },
            { path: '/:id/versions', method: 'GET', description: 'Get prompt versions' }
          ]
        },
        llm: {
          base: '/llm',
          routes: [
            { path: '/enhance', method: 'POST', description: 'Enhance prompt' },
            { path: '/validate', method: 'POST', description: 'Validate prompt' },
            { path: '/auto-tag', method: 'POST', description: 'Auto-generate tags' },
            { path: '/auto-categorize', method: 'POST', description: 'Auto-categorize prompt' }
          ]
        }
      }
    }
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;