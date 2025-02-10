<documents>
<document>
<source>project-structure.md</source>
<document_content>
Project File Tree (excluding .git, .txt, and .md files):
----------------------------------------------------
.
├── backend
│   ├── config
│   │   ├── auth.js
│   │   ├── database.js
│   │   └── llm.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── validate.js
│   ├── models
│   │   ├── Prompt.js
│   │   └── User.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── llm.js
│   │   └── prompts.js
│   ├── services
│   │   ├── authService.js
│   │   ├── llmService.js
│   │   └── promptService.js
│   └── src
│       ├── app.js
│       └── server.js
├── diagrams
├── docker-compose.yml
├── Dockerfile
├── manifest.json
├── package.json
├── public
├── scaffold2.sh
├── src
│   ├── components
│   │   ├── layout
│   │   │   ├── EditorLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── prompt
│   │   │   ├── editor
│   │   │   │   ├── EditorControls.jsx
│   │   │   │   ├── EditorToolbar.jsx
│   │   │   │   └── VersionHistory.jsx
│   │   │   ├── enhancement
│   │   │   │   ├── EnhancementOptions.jsx
│   │   │   │   ├── EnhancementPreview.jsx
│   │   │   │   └── ProviderSettings.jsx
│   │   │   ├── list
│   │   │   │   ├── ListControls.jsx
│   │   │   │   ├── PromptCard.jsx
│   │   │   │   ├── PromptGrid.jsx
│   │   │   │   └── PromptTable.jsx
│   │   │   ├── LLMEnhancer.jsx
│   │   │   ├── PromptEditor.jsx
│   │   │   ├── PromptList.jsx
│   │   │   ├── template
│   │   │   │   ├── TemplatePreviewer.jsx
│   │   │   │   ├── VariableForm.jsx
│   │   │   │   └── VariableList.jsx
│   │   │   └── TemplateHandler.jsx
│   │   └── ui
│   │       ├── alert
│   │       │   ├── Alert.jsx
│   │       │   └── AlertProvider.jsx
│   │       ├── Alert.jsx
│   │       ├── button
│   │       │   └── IconButton.jsx
│   │       ├── Button.jsx
│   │       ├── card
│   │       │   └── CardContent.jsx
│   │       ├── Card.jsx
│   │       ├── dialog
│   │       │   └── DialogContent.jsx
│   │       ├── Dialog.jsx
│   │       ├── select
│   │       │   └── SelectItem.jsx
│   │       ├── Select.jsx
│   │       ├── tabs
│   │       │   └── TabPanel.jsx
│   │       └── Tabs.jsx
│   ├── contexts
│   │   ├── AuthContext.jsx
│   │   ├── PromptContext.jsx
│   │   ├── TemplateContext.jsx
│   │   └── UIContext.jsx
│   ├── extension
│   │   ├── background
│   │   │   └── background.js
│   │   └── content
│   │       ├── contentScript.js
│   │       └── pageUtils.js
│   ├── hooks
│   │   ├── auth
│   │   │   └── usePermissions.js
│   │   ├── llm
│   │   │   └── useEnhancement.js
│   │   ├── prompt
│   │   │   └── useVersions.js
│   │   ├── template
│   │   │   └── useVariables.js
│   │   ├── useAuth.js
│   │   ├── useLLM.js
│   │   ├── usePrompts.js
│   │   └── useTemplates.js
│   ├── popup.html
│   ├── popup.js
│   ├── services
│   │   ├── api
│   │   │   ├── authApi.js
│   │   │   ├── llmApi.js
│   │   │   └── promptApi.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── storage
│   │   │   └── chromeStorage.js
│   │   ├── storage.js
│   │   └── utils
│   │       ├── enhancementUtils.js
│   │       └── promptValidator.js
│   ├── styles
│   │   ├── components
│   │   │   ├── editor.css
│   │   │   ├── prompt.css
│   │   │   └── template.css
│   │   ├── main.css
│   │   └── themes
│   │       ├── dark.css
│   │       └── light.css
│   └── utils
│       ├── constants.js
│       ├── templateParser.js
│       └── validators.js
└── tailwind.config.js

42 directories, 91 files
----------------------------------------------------
</document_content>
</document>

<document>
<source>./backend/config/llm.js</source>
<document_content>
const llmConfig = {
 // Provider settings will be user-configurable
 defaultProvider: 'openai',
 
 // Enhancement types configuration
 enhancementTypes: {
   clarity: {
     instruction: 'Improve the clarity and readability of this prompt while maintaining its original intent.',
     temperature: 0.5
   },
   specificity: {
     instruction: 'Make this prompt more specific and detailed while preserving its core purpose.',
     temperature: 0.6
   },
   context: {
     instruction: 'Add relevant context to this prompt to improve its effectiveness.',
     temperature: 0.7
   },
   creativity: {
     instruction: 'Enhance the creativity of this prompt while keeping its primary objective.',
     temperature: 0.8
   }
 },

 // Prompt validation configuration
 validation: {
   minLength: 10,
   maxLength: 4000,
   forbiddenPatterns: [
     /(<script)|(<iframe)|(<object)/i, // Prevent XSS
     /(DROP TABLE)|(DELETE FROM)|(INSERT INTO)/i // Prevent SQL injection attempts
   ]
 },

 // Error messages
 errors: {
   INVALID_MODEL: 'Invalid model specified',
   INVALID_PROMPT: 'Invalid prompt content',
   API_ERROR: 'LLM API error occurred',
   TIMEOUT: 'Request timed out'
 },

 // Helper functions
 validatePrompt: (prompt) => {
   if (!prompt || typeof prompt !== 'string') {
     return { isValid: false, error: 'Prompt must be a non-empty string' };
   }

   if (prompt.length < llmConfig.validation.minLength) {
     return { isValid: false, error: `Prompt must be at least ${llmConfig.validation.minLength} characters` };
   }

   if (prompt.length > llmConfig.validation.maxLength) {
     return { isValid: false, error: `Prompt must be less than ${llmConfig.validation.maxLength} characters` };
   }

   for (const pattern of llmConfig.validation.forbiddenPatterns) {
     if (pattern.test(prompt)) {
       return { isValid: false, error: 'Prompt contains forbidden patterns' };
     }
   }

   return { isValid: true };
 }
};

export default llmConfig;</document_content>
</document>

<document>
<source>./backend/config/database.js</source>
<document_content>
import mongoose from 'mongoose';

const dbConfig = {
  // Database connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
  },

  // Connect to MongoDB
  connect: async () => {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prompthub';
      await mongoose.connect(uri, dbConfig.options);
      console.log('MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed through app termination');
          process.exit(0);
        } catch (err) {
          console.error('Error closing MongoDB connection:', err);
          process.exit(1);
        }
      });
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  },

  // Disconnect from MongoDB
  disconnect: async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB disconnected successfully');
    } catch (err) {
      console.error('Error disconnecting from MongoDB:', err);
      throw err;
    }
  },

  // Clear all collections (useful for testing)
  clearCollections: async () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('clearCollections can only be called in test environment');
    }
    
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
};

export default dbConfig;</document_content>
</document>

<document>
<source>./backend/config/auth.js</source>
<document_content>
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

export default authConfig;</document_content>
</document>

<document>
<source>./backend/middleware/error.js</source>
<document_content>
// Custom error class for API errors
class APIError extends Error {
 constructor(statusCode, message) {
   super(message);
   this.statusCode = statusCode;
   this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
   this.isOperational = true;

   Error.captureStackTrace(this, this.constructor);
 }
}

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'error';

 if (process.env.NODE_ENV === 'development') {
   return res.status(err.statusCode).json({
     status: err.status,
     error: err,
     message: err.message,
     stack: err.stack
   });
 }

 // Production error handling
 if (err.isOperational) {
   // Operational errors - send message to client
   return res.status(err.statusCode).json({
     status: err.status,
     message: err.message
   });
 }

 // Programming or unknown errors - don't leak error details
 console.error('ERROR 💥:', err);
 return res.status(500).json({
   status: 'error',
   message: 'Something went wrong'
 });
};

// Not Found error handler
const notFound = (req, res, next) => {
 const err = new APIError(404, `Route ${req.originalUrl} not found`);
 next(err);
};

// MongoDB error handler
const handleMongoError = (err) => {
 if (err.name === 'CastError') {
   return new APIError(400, `Invalid ${err.path}: ${err.value}`);
 }
 if (err.code === 11000) {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
   return new APIError(400, `Duplicate field value: ${value}`);
 }
 if (err.name === 'ValidationError') {
   const errors = Object.values(err.errors).map(el => el.message);
   return new APIError(400, `Invalid input data. ${errors.join('. ')}`);
 }
 return err;
};

// Rate limiting error handler
const handleRateLimitError = (err) => {
 if (err.status === 429) {
   return new APIError(429, 'Too many requests. Please try again later.');
 }
 return err;
};

export { 
 APIError, 
 errorHandler, 
 notFound, 
 handleMongoError, 
 handleRateLimitError 
};</document_content>
</document>

<document>
<source>./backend/middleware/auth.js</source>
<document_content>
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

export default authMiddleware;</document_content>
</document>

<document>
<source>./backend/middleware/validate.js</source>
<document_content>
import { APIError } from './error.js';
import llmConfig from '../config/llm.js';

const validateMiddleware = {
  // Validate request body exists
  validateBody: (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new APIError(400, 'Request body is required'));
    }
    next();
  },

  // Validate prompt data
  validatePrompt: (req, res, next) => {
    const { content, title, category, llmType, promptType } = req.body;

    // Check required fields
    if (!content || !title) {
      return next(new APIError(400, 'Content and title are required'));
    }

    // Validate prompt content
    const validationResult = llmConfig.validatePrompt(content);
    if (!validationResult.isValid) {
      return next(new APIError(400, validationResult.error));
    }

    // Validate title length
    if (title.length > 100) {
      return next(new APIError(400, 'Title must be less than 100 characters'));
    }

    // Validate category if provided
    if (category && category.length > 50) {
      return next(new APIError(400, 'Category must be less than 50 characters'));
    }

    // Validate LLM type if provided
    const validLLMTypes = ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'local', 'other'];
    if (llmType && !validLLMTypes.includes(llmType)) {
      return next(new APIError(400, 'Invalid LLM type'));
    }

    // Validate prompt type if provided
    const validPromptTypes = ['chat', 'completion', 'function', 'system', 'other'];
    if (promptType && !validPromptTypes.includes(promptType)) {
      return next(new APIError(400, 'Invalid prompt type'));
    }

    next();
  },

  // Validate enhancement request
  validateEnhancement: (req, res, next) => {
    const { content, enhancement } = req.body;

    if (!content || !enhancement) {
      return next(new APIError(400, 'Content and enhancement type are required'));
    }

    const validEnhancements = ['clarity', 'specificity', 'context', 'creativity'];
    if (!validEnhancements.includes(enhancement)) {
      return next(new APIError(400, 'Invalid enhancement type'));
    }

    const validationResult = llmConfig.validatePrompt(content);
    if (!validationResult.isValid) {
      return next(new APIError(400, validationResult.error));
    }

    next();
  },

  // Validate pagination parameters
  validatePagination: (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1) {
      return next(new APIError(400, 'Page must be greater than 0'));
    }

    if (limit < 1 || limit > 100) {
      return next(new APIError(400, 'Limit must be between 1 and 100'));
    }

    req.pagination = { page, limit };
    next();
  },

  // Validate MongoDB ID
  validateMongoId: (req, res, next) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new APIError(400, 'Invalid ID format'));
    }
    next();
  },

  // Validate template syntax
  validateTemplate: (req, res, next) => {
    const { content } = req.body;
    if (!content) {
      return next(new APIError(400, 'Template content is required'));
    }

    // Check for balanced template variables
    const openBraces = (content.match(/{{/g) || []).length;
    const closeBraces = (content.match(/}}/g) || []).length;

    if (openBraces !== closeBraces) {
      return next(new APIError(400, 'Template has unmatched braces'));
    }

    // Check for empty variables
    if (content.match(/{{\s*}}/g)) {
      return next(new APIError(400, 'Template contains empty variables'));
    }

    // Check for valid variable names
    const varNameRegex = /{{([^}]+)}}/g;
    let match;
    while ((match = varNameRegex.exec(content)) !== null) {
      const varName = match[1].trim();
      if (!/^[a-zA-Z0-9_]+$/.test(varName)) {
        return next(new APIError(400, `Invalid variable name: ${varName}`));
      }
    }

    next();
  }
};

export default validateMiddleware;</document_content>
</document>

<document>
<source>./backend/services/authService.js</source>
<document_content>
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

export default new AuthService();</document_content>
</document>

<document>
<source>./backend/services/llmService.js</source>
<document_content>
import OpenAI from 'openai';
import llmConfig from '../config/llm.js';
import { APIError } from '../middleware/error.js';

class LLMService {
  constructor() {
    this.providers = {
      openai: null
    };
  }

  initializeProvider(provider, apiKey) {
    switch (provider) {
      case 'openai':
        this.providers.openai = new OpenAI({
          apiKey,
          baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
        });
        break;
      default:
        throw new APIError(400, 'Unsupported LLM provider');
    }
  }

  async enhancePrompt(content, enhancement, provider = 'openai', model = 'gpt-4') {
    try {
      if (!llmConfig.enhancementTypes[enhancement]) {
        throw new APIError(400, 'Invalid enhancement type');
      }

      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const enhancementConfig = llmConfig.enhancementTypes[enhancement];
      
      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: enhancementConfig.instruction
          },
          {
            role: "user",
            content
          }
        ],
        temperature: enhancementConfig.temperature
      });

      return {
        enhancedPrompt: completion.choices[0].message.content,
        usage: completion.usage
      };
    } catch (error) {
      throw new APIError(500, 'Error enhancing prompt: ' + error.message);
    }
  }

  async generateTags(content, provider = 'openai', model = 'gpt-4') {
    try {
      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Generate relevant tags for the following prompt. Return them as a comma-separated list."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.3
      });

      return completion.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    } catch (error) {
      throw new APIError(500, 'Error generating tags: ' + error.message);
    }
  }

  async suggestCategory(content, provider = 'openai', model = 'gpt-4') {
    try {
      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Suggest a single category for the following prompt. Return only the category name."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.3
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      throw new APIError(500, 'Error suggesting category: ' + error.message);
    }
  }

  validatePrompt(content) {
    return llmConfig.validatePrompt(content);
  }

  async analyzePromptQuality(content, provider = 'openai', model = 'gpt-4') {
    try {
      if (!this.providers[provider]) {
        this.initializeProvider(provider, process.env.OPENAI_API_KEY);
      }

      const completion = await this.providers[provider].chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Analyze the following prompt and provide feedback on its quality. Consider clarity, specificity, and potential improvements."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.7
      });

      return {
        analysis: completion.choices[0].message.content,
        usage: completion.usage
      };
    } catch (error) {
      throw new APIError(500, 'Error analyzing prompt: ' + error.message);
    }
  }
}

export default new LLMService();</document_content>
</document>

<document>
<source>./backend/services/promptService.js</source>
<document_content>
import Prompt from '../models/Prompt.js';
import { APIError } from '../middleware/error.js';

class PromptService {
  async getPrompts(query, pagination) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skipAmount = (page - 1) * limit;

      const prompts = await Prompt.find(query)
        .skip(skipAmount)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Prompt.countDocuments(query);

      return {
        prompts,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new APIError(500, 'Error fetching prompts');
    }
  }

  async createPrompt(promptData) {
    try {
      const prompt = await Prompt.create(promptData);
      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error creating prompt');
    }
  }

  async getPromptById(id, userId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error fetching prompt');
    }
  }

  async updatePrompt(id, userId, updateData) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      // Store current version before updating
      await prompt.addVersion(prompt.content);

      // Update prompt
      Object.assign(prompt, updateData);
      await prompt.save();

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error updating prompt');
    }
  }

  async deletePrompt(id, userId) {
    try {
      const prompt = await Prompt.findOneAndDelete({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error deleting prompt');
    }
  }

  async getPromptVersions(id, userId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      return prompt.versions;
    } catch (error) {
      throw new APIError(500, 'Error fetching prompt versions');
    }
  }

  async restoreVersion(id, userId, versionId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      const version = prompt.versions.id(versionId);
      if (!version) {
        throw new APIError(404, 'Version not found');
      }

      // Store current version before restoring
      await prompt.addVersion(prompt.content);
      
      // Restore the selected version
      prompt.content = version.content;
      await prompt.save();

      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error restoring prompt version');
    }
  }

  async getCategories(userId) {
    try {
      return await Prompt.distinct('category', { userId });
    } catch (error) {
      throw new APIError(500, 'Error fetching categories');
    }
  }

  async getTags(userId) {
    try {
      return await Prompt.distinct('tags', { userId });
    } catch (error) {
      throw new APIError(500, 'Error fetching tags');
    }
  }

  async getPopularPrompts(limit = 10) {
    try {
      return await Prompt.findPopular(limit);
    } catch (error) {
      throw new APIError(500, 'Error fetching popular prompts');
    }
  }

  async incrementUsage(id, userId) {
    try {
      const prompt = await Prompt.findOne({ _id: id, userId });
      
      if (!prompt) {
        throw new APIError(404, 'Prompt not found');
      }

      await prompt.incrementUsage();
      return prompt;
    } catch (error) {
      throw new APIError(500, 'Error incrementing prompt usage');
    }
  }
}

export default new PromptService();</document_content>
</document>

<document>
<source>./backend/src/server.js</source>
<document_content>
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import dbConfig from '../config/database.js';

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB
dbConfig.connect().catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  
  // Log available routes
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push(`${Object.keys(handler.route.methods)} ${middleware.regexp} ${handler.route.path}`);
        }
      });
    }
  });
  console.log('\nRegistered Routes:');
  routes.forEach(route => console.log(`  ${route}`));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

export default server;</document_content>
</document>

<document>
<source>./backend/src/app.js</source>
<document_content>
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

export default app;</document_content>
</document>

<document>
<source>./backend/models/User.js</source>
<document_content>
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  picture: {
    type: String,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  settings: {
    defaultLLMProvider: {
      type: String,
      enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'other'],
      default: 'gpt-3.5-turbo'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    promptsPerPage: {
      type: Number,
      default: 10,
      min: 5,
      max: 100
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's prompts
userSchema.virtual('prompts', {
  ref: 'Prompt',
  localField: '_id',
  foreignField: 'userId'
});

// Update lastLogin timestamp
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  return this.save();
};

// Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set default settings for new users
    this.settings = {
      ...this.settings,
      defaultLLMProvider: 'gpt-3.5-turbo',
      theme: 'system',
      promptsPerPage: 10
    };
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;</document_content>
</document>

<document>
<source>./backend/models/Prompt.js</source>
<document_content>
import mongoose from 'mongoose';

const promptVersionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  enhancement: {
    type: String,
    enum: ['clarity', 'specificity', 'context', 'creativity', 'original', 'other'],
    default: 'original'
  }
});

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxLength: [4000, 'Content cannot be more than 4000 characters']
  },
  category: {
    type: String,
    trim: true,
    maxLength: [50, 'Category cannot be more than 50 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  llmType: {
    type: String,
    enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'local', 'other'],
    default: 'gpt-3.5-turbo'
  },
  promptType: {
    type: String,
    enum: ['chat', 'completion', 'function', 'system', 'other'],
    default: 'chat'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateFields: [{
    type: String,
    trim: true
  }],
  versions: [promptVersionSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
promptSchema.index({ userId: 1, createdAt: -1 });
promptSchema.index({ category: 1, createdAt: -1 });
promptSchema.index({ tags: 1 });
promptSchema.index({ 
  title: 'text', 
  content: 'text', 
  category: 'text', 
  tags: 'text' 
});

// Virtual for formatted creation date
promptSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to add a new version
promptSchema.methods.addVersion = function(content, enhancement = 'other') {
  this.versions.push({
    content,
    enhancement,
    timestamp: new Date()
  });
  return this.save();
};

// Method to increment usage count
promptSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Pre-save middleware
promptSchema.pre('save', function(next) {
  if (this.isNew) {
    // Add the initial content as the first version
    this.versions = [{
      content: this.content,
      enhancement: 'original'
    }];
  }
  next();
});

// Static method to find popular prompts
promptSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ usageCount: -1 })
    .limit(limit)
    .populate('userId', 'name');
};

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;</document_content>
</document>

<document>
<source>./backend/routes/llm.js</source>
<document_content>
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import validateMiddleware from '../middleware/validate.js';
import { APIError } from '../middleware/error.js';
import llmConfig from '../config/llm.js';
import OpenAI from 'openai';

const router = express.Router();

// Apply auth middleware to all LLM routes
router.use(authMiddleware.verifyToken);

// Initialize OpenAI with user's API key
const getOpenAI = (apiKey) => {
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
  });
};

// Enhance prompt
router.post('/enhance',
  validateMiddleware.validateEnhancement,
  async (req, res, next) => {
    try {
      const { content, enhancement, model = 'gpt-4' } = req.body;
      
      if (!llmConfig.enhancementTypes[enhancement]) {
        throw new APIError(400, 'Invalid enhancement type');
      }

      const openai = getOpenAI(process.env.OPENAI_API_KEY);

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: llmConfig.enhancementTypes[enhancement].instruction
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: llmConfig.enhancementTypes[enhancement].temperature
      });

      res.status(200).json({
        status: 'success',
        data: {
          enhancedPrompt: completion.choices[0].message.content,
          usage: completion.usage
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Validate prompt
router.post('/validate',
  validateMiddleware.validateBody,
  async (req, res, next) => {
    try {
      const { content } = req.body;
      const validation = llmConfig.validatePrompt(content);

      res.status(200).json({
        status: 'success',
        data: validation
      });
    } catch (error) {
      next(error);
    }
  }
);

// Auto-tag prompt
router.post('/auto-tag',
  validateMiddleware.validateBody,
  async (req, res, next) => {
    try {
      const { content, model = 'gpt-4' } = req.body;
      const openai = getOpenAI(process.env.OPENAI_API_KEY);

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Generate relevant tags for the following prompt. Return them as a comma-separated list."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.3
      });

      const tags = completion.choices[0].message.content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      res.status(200).json({
        status: 'success',
        data: { tags }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Auto-categorize prompt
router.post('/auto-categorize',
  validateMiddleware.validateBody,
  async (req, res, next) => {
    try {
      const { content, model = 'gpt-4' } = req.body;
      const openai = getOpenAI(process.env.OPENAI_API_KEY);

      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Suggest a single category for the following prompt. Return only the category name."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.3
      });

      const category = completion.choices[0].message.content.trim();

      res.status(200).json({
        status: 'success',
        data: { category }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;</document_content>
</document>

<document>
<source>./backend/routes/prompts.js</source>
<document_content>
</document_content>
</document>

<document>
<source>./backend/routes/auth.js</source>
<document_content>
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

export default router;</document_content>
</document>

<document>
<source>./src/styles/themes/dark.css</source>
<document_content>
/* TODO: Add styles */
</document_content>
</document>

<document>
<source>./src/styles/themes/light.css</source>
<document_content>
/* TODO: Add styles */
</document_content>
</document>

<document>
<source>./src/styles/main.css</source>
<document_content>
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 263.4 70% 50.4%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom animations */
@layer utilities {
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
}

/* Glass morphism effects */
.glass {
  @apply bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg;
}

.glass-dark {
  @apply bg-gray-900 bg-opacity-10 backdrop-filter backdrop-blur-lg;
}

/* Custom scrollbar */
.custom-scrollbar {
  @apply scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent;
}</document_content>
</document>

<document>
<source>./src/styles/components/prompt.css</source>
<document_content>
/* TODO: Add styles */
</document_content>
</document>

<document>
<source>./src/styles/components/editor.css</source>
<document_content>
/* TODO: Add styles */
</document_content>
</document>

<document>
<source>./src/styles/components/template.css</source>
<document_content>
/* TODO: Add styles */
</document_content>
</document>

<document>
<source>./src/utils/templateParser.js</source>
<document_content>
import { TEMPLATE_PATTERNS } from './constants';
import { validators } from './validators';

export const templateParser = {
  // Extract all variables from a template
  extractVariables: (template) => {
    const variables = new Set();
    let match;

    while ((match = TEMPLATE_PATTERNS.VARIABLE.exec(template)) !== null) {
      variables.add(match[1].trim());
    }

    return Array.from(variables);
  },

  // Parse and validate a template
  parseTemplate: (template) => {
    const validation = validators.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
    }

    return {
      variables: templateParser.extractVariables(template)
    };
  },

  // Fill template with values
  fillTemplate: (template, values) => {
    let result = template;

    // Replace variables
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  },

  // Preview template with values
  previewTemplate: (template, values) => {
    try {
      return templateParser.fillTemplate(template, values);
    } catch (error) {
      return `Preview Error: ${error.message}`;
    }
  },

  // Validate template values
  validateTemplateValues: (template, values) => {
    const variables = templateParser.extractVariables(template);
    const missing = variables.filter(variable => !(variable in values));
    
    return {
      isValid: missing.length === 0,
      missing
    };
  }
};</document_content>
</document>

<document>
<source>./src/utils/validators.js</source>
<document_content>
import { VALIDATION, LLM_TYPES, PROMPT_TYPES } from './constants';

export const validators = {
  // Validate prompt data
  validatePrompt: (promptData) => {
    const errors = {};

    // Check title
    if (!promptData.title) {
      errors.title = 'Title is required';
    } else if (promptData.title.length > VALIDATION.MAX_TITLE_LENGTH) {
      errors.title = `Title must be less than ${VALIDATION.MAX_TITLE_LENGTH} characters`;
    }

    // Check content
    if (!promptData.content) {
      errors.content = 'Content is required';
    } else if (promptData.content.length < VALIDATION.MIN_PROMPT_LENGTH) {
      errors.content = `Content must be at least ${VALIDATION.MIN_PROMPT_LENGTH} characters`;
    } else if (promptData.content.length > VALIDATION.MAX_PROMPT_LENGTH) {
      errors.content = `Content must be less than ${VALIDATION.MAX_PROMPT_LENGTH} characters`;
    }

    // Check category length if provided
    if (promptData.category && promptData.category.length > VALIDATION.MAX_CATEGORY_LENGTH) {
      errors.category = `Category must be less than ${VALIDATION.MAX_CATEGORY_LENGTH} characters`;
    }

    // Validate LLM type
    if (!Object.values(LLM_TYPES).includes(promptData.llmType)) {
      errors.llmType = 'Invalid LLM type';
    }

    // Validate prompt type
    if (!Object.values(PROMPT_TYPES).includes(promptData.promptType)) {
      errors.promptType = 'Invalid prompt type';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate template syntax
  validateTemplate: (content) => {
    const errors = [];
    
    // Check for unmatched template variables
    const openBraces = (content.match(/{{/g) || []).length;
    const closeBraces = (content.match(/}}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push('Unmatched template braces');
    }

    // Check for empty variables
    const emptyVarMatch = content.match(/{{\s*}}/g);
    if (emptyVarMatch) {
      errors.push('Empty template variables found');
    }

    // Check for invalid characters in variable names
    const varNameRegex = /{{([^}]+)}}/g;
    let match;
    while ((match = varNameRegex.exec(content)) !== null) {
      const varName = match[1].trim();
      if (!/^[a-zA-Z0-9_]+$/.test(varName)) {
        errors.push(`Invalid variable name: ${varName}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate enhancement request
  validateEnhancement: (content, enhancementType) => {
    const errors = {};

    if (!content) {
      errors.content = 'Content is required for enhancement';
    }

    if (!enhancementType) {
      errors.enhancementType = 'Enhancement type is required';
    }

    if (content && content.length > VALIDATION.MAX_PROMPT_LENGTH) {
      errors.content = `Content must be less than ${VALIDATION.MAX_PROMPT_LENGTH} characters`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Utility function to validate object against schema
  validateSchema: (data, schema) => {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && !value) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (value) {
        if (rules.min && value.length < rules.min) {
          errors[field] = `${field} must be at least ${rules.min} characters`;
        }

        if (rules.max && value.length > rules.max) {
          errors[field] = `${field} must be less than ${rules.max} characters`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = `${field} format is invalid`;
        }

        if (rules.enum && !rules.enum.includes(value)) {
          errors[field] = `${field} must be one of: ${rules.enum.join(', ')}`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};</document_content>
</document>

<document>
<source>./src/utils/constants.js</source>
<document_content>
// API Constants
export const API_BASE_URL = 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// LLM Types
export const LLM_TYPES = {
  GPT35: 'gpt-3.5-turbo',
  GPT4: 'gpt-4',
  CLAUDE: 'claude-3',
  OTHER: 'other'
};

// Prompt Types
export const PROMPT_TYPES = {
  CHAT: 'chat',
  COMPLETION: 'completion',
  SYSTEM: 'system',
  OTHER: 'other'
};

// Enhancement Types
export const ENHANCEMENT_TYPES = {
  CLARITY: 'clarity',
  SPECIFICITY: 'specificity',
  CONTEXT: 'context',
  CREATIVITY: 'creativity'
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PROMPTS_CACHE: 'prompts_cache',
  SETTINGS: 'settings',
  SITE_INTEGRATIONS: 'site_integrations'
};

// Cache Durations (in hours)
export const CACHE_DURATION = {
  PROMPTS: 24,
  USER: 168 // 1 week
};

// Validation Constants
export const VALIDATION = {
  MAX_PROMPT_LENGTH: 4000,
  MAX_TITLE_LENGTH: 100,
  MAX_CATEGORY_LENGTH: 50,
  MIN_PROMPT_LENGTH: 10
};

// Template Patterns
export const TEMPLATE_PATTERNS = {
  VARIABLE: /{{([^}]+)}}/g
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error occurred. Please check your connection.',
  AUTH: 'Authentication failed. Please log in again.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error occurred. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please try again later.'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};</document_content>
</document>

<document>
<source>./src/hooks/prompt/useVersions.js</source>
<document_content>
import { useState } from 'react';

const useVersions = () => {
  // TODO: Implement useVersions
  
  return {
    // Add hook return values
  };
};

export default useVersions;
</document_content>
</document>

<document>
<source>./src/hooks/usePrompts.js</source>
<document_content>
import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const usePrompts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPrompts = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getPrompts(params);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPrompt = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const { prompts } = await api.getPrompts({ id });
      return prompts[0];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPrompt = useCallback(async (promptData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.createPrompt(promptData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePrompt = useCallback(async (id, promptData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.updatePrompt(id, promptData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePrompt = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.deletePrompt(id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getPrompts,
    getPrompt,
    createPrompt,
    updatePrompt,
    deletePrompt
  };
};</document_content>
</document>

<document>
<source>./src/hooks/useAuth.js</source>
<document_content>
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await api.login();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };
};</document_content>
</document>

<document>
<source>./src/hooks/useTemplates.js</source>
<document_content>
import { useState, useCallback } from 'react';

export const useTemplates = () => {
  const [templateFields, setTemplateFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [error, setError] = useState(null);

  const extractTemplateFields = useCallback((content) => {
    const regex = /{{([^}]+)}}/g;
    const fields = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      fields.push(match[1].trim());
    }
    
    setTemplateFields([...new Set(fields)]);
    return fields;
  }, []);

  const updateFieldValue = useCallback((field, value) => {
    setFieldValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const fillTemplate = useCallback((content) => {
    let filledContent = content;
    Object.entries(fieldValues).forEach(([field, value]) => {
      const regex = new RegExp(`{{\\s*${field}\\s*}}`, 'g');
      filledContent = filledContent.replace(regex, value);
    });
    return filledContent;
  }, [fieldValues]);

  const resetFields = useCallback(() => {
    setFieldValues({});
    setTemplateFields([]);
    setError(null);
  }, []);

  const validateTemplate = useCallback((content) => {
    try {
      const fields = extractTemplateFields(content);
      const missingFields = fields.filter(field => !fieldValues[field]);
      if (missingFields.length > 0) {
        setError(`Missing values for fields: ${missingFields.join(', ')}`);
        return false;
      }
      setError(null);
      return true;
    } catch (err) {
      setError('Template validation failed');
      return false;
    }
  }, [extractTemplateFields, fieldValues]);

  return {
    templateFields,
    fieldValues,
    error,
    extractTemplateFields,
    updateFieldValue,
    fillTemplate,
    resetFields,
    validateTemplate
  };
};</document_content>
</document>

<document>
<source>./src/hooks/template/useVariables.js</source>
<document_content>
import { useState } from 'react';

const useVariables = () => {
  // TODO: Implement useVariables
  
  return {
    // Add hook return values
  };
};

export default useVariables;
</document_content>
</document>

<document>
<source>./src/hooks/auth/usePermissions.js</source>
<document_content>
import { useState } from 'react';

const usePermissions = () => {
  // TODO: Implement usePermissions
  
  return {
    // Add hook return values
  };
};

export default usePermissions;
</document_content>
</document>

<document>
<source>./src/hooks/useLLM.js</source>
<document_content>
import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useLLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enhancePrompt = useCallback(async (content, enhancementType, llmType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.enhancePrompt(content, enhancementType, llmType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validatePrompt = useCallback(async (content, llmType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.enhancePrompt(content, 'validate', llmType);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    enhancePrompt,
    validatePrompt
  };
};</document_content>
</document>

<document>
<source>./src/hooks/llm/useEnhancement.js</source>
<document_content>
import { useState } from 'react';

const useEnhancement = () => {
  // TODO: Implement useEnhancement
  
  return {
    // Add hook return values
  };
};

export default useEnhancement;
</document_content>
</document>

<document>
<source>./src/services/api.js</source>
<document_content>
// services/api.js
const BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Prompt Management
  async getPrompts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/prompts?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch prompts');
    return response.json();
  },

  async createPrompt(promptData) {
    const response = await fetch(`${BASE_URL}/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData)
    });
    if (!response.ok) throw new Error('Failed to create prompt');
    return response.json();
  },

  async updatePrompt(id, promptData) {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData)
    });
    if (!response.ok) throw new Error('Failed to update prompt');
    return response.json();
  },

  async deletePrompt(id) {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete prompt');
    return response.json();
  },

  // LLM Enhancement
  async enhancePrompt(content, enhancementType, llmType = 'gpt-4') {
    const response = await fetch(`${BASE_URL}/enhance-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        enhancement: enhancementType,
        llmType
      })
    });
    if (!response.ok) throw new Error('Failed to enhance prompt');
    return response.json();
  },

  // Auth Management
  async getCurrentUser() {
    const user = await chrome.storage.local.get('user');
    return user.user;
  },

  async login() {
    try {
      const auth = await chrome.identity.getAuthToken({ interactive: true });
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (!response.ok) throw new Error('Failed to get user info');
      const user = await response.json();
      await chrome.storage.local.set({ user });
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  async logout() {
    await chrome.storage.local.remove('user');
  }
};

// Error handling middleware
export const withErrorHandling = (apiCall) => async (...args) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    console.error('API Error:', error);
    // You can add more error handling logic here
    throw error;
  }
};

// Cached API calls with error handling
export const apiWithCache = {
  getPrompts: withErrorHandling(async (params) => {
    const cacheKey = `prompts-${JSON.stringify(params)}`;
    const cached = await chrome.storage.local.get(cacheKey);
    
    if (cached[cacheKey]) {
      // Return cached data immediately
      return cached[cacheKey];
    }

    // Fetch fresh data
    const data = await api.getPrompts(params);
    
    // Cache the results
    await chrome.storage.local.set({
      [cacheKey]: {
        ...data,
        cachedAt: Date.now()
      }
    });

    return data;
  })
};

// WebSocket connection for real-time updates (if needed)
export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return this.ws;
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 1000 * Math.pow(2, this.reconnectAttempts));
    }
  }

  subscribe(event, callback) {
    if (!this.ws) this.connect();
    this.ws.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);
      if (data.event === event) {
        callback(data.payload);
      }
    });
  }

  send(event, data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    this.ws.send(JSON.stringify({ event, data }));
  }
}

export const wsClient = new WebSocketClient();</document_content>
</document>

<document>
<source>./src/services/storage/chromeStorage.js</source>
<document_content>
// TODO: Implement chromeStorage

export const chromeStorage = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/services/auth.js</source>
<document_content>
import { storage } from './storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const auth = {
  // Initialize auth state from storage
  async init() {
    const token = await storage.get(AUTH_TOKEN_KEY);
    const userData = await storage.get(USER_KEY);
    return { token, user: userData };
  },

  // Get current auth token
  async getToken() {
    return await storage.get(AUTH_TOKEN_KEY);
  },

  // Get current user data
  async getCurrentUser() {
    return await storage.get(USER_KEY);
  },

  // Handle Google OAuth login
  async loginWithGoogle() {
    try {
      const auth = await chrome.identity.getAuthToken({ interactive: true });
      
      // Get user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await response.json();
      
      // Store auth data
      await storage.setMultiple({
        [AUTH_TOKEN_KEY]: auth.token,
        [USER_KEY]: userData
      });

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const token = await this.getToken();
      if (token) {
        // Revoke Google OAuth token
        await chrome.identity.removeCachedAuthToken({ token });
      }
      
      // Clear stored auth data
      await storage.remove(AUTH_TOKEN_KEY);
      await storage.remove(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await this.getToken();
      const user = await this.getCurrentUser();
      return !!(token && user);
    } catch {
      return false;
    }
  },

  // Refresh auth token if needed
  async refreshTokenIfNeeded() {
    try {
      const token = await this.getToken();
      if (!token) return null;

      // Check token validity with Google
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        params: { access_token: token }
      });

      if (!response.ok) {
        // Token is invalid, get a new one
        await chrome.identity.removeCachedAuthToken({ token });
        const newAuth = await chrome.identity.getAuthToken({ interactive: false });
        await storage.set(AUTH_TOKEN_KEY, newAuth.token);
        return newAuth.token;
      }

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
};</document_content>
</document>

<document>
<source>./src/services/utils/promptValidator.js</source>
<document_content>
// TODO: Implement promptValidator

export const promptValidator = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/services/utils/enhancementUtils.js</source>
<document_content>
// TODO: Implement enhancementUtils

export const enhancementUtils = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/services/storage.js</source>
<document_content>
export const storage = {
 // Get a value from storage
 async get(key) {
   try {
     const result = await chrome.storage.local.get(key);
     return result[key];
   } catch (error) {
     console.error('Storage get error:', error);
     throw error;
   }
 },

 // Set a value in storage
 async set(key, value) {
   try {
     await chrome.storage.local.set({ [key]: value });
   } catch (error) {
     console.error('Storage set error:', error);
     throw error;
   }
 },

 // Remove a value from storage
 async remove(key) {
   try {
     await chrome.storage.local.remove(key);
   } catch (error) {
     console.error('Storage remove error:', error);
     throw error;
   }
 },

 // Clear all extension storage
 async clear() {
   try {
     await chrome.storage.local.clear();
   } catch (error) {
     console.error('Storage clear error:', error);
     throw error;
   }
 },

 // Get multiple values from storage
 async getMultiple(keys) {
   try {
     const result = await chrome.storage.local.get(keys);
     return result;
   } catch (error) {
     console.error('Storage getMultiple error:', error);
     throw error;
   }
 },

 // Set multiple values in storage
 async setMultiple(items) {
   try {
     await chrome.storage.local.set(items);
   } catch (error) {
     console.error('Storage setMultiple error:', error);
     throw error;
   }
 },

 // Watch for changes to storage
 addChangeListener(callback) {
   chrome.storage.onChanged.addListener((changes, areaName) => {
     if (areaName === 'local') {
       callback(changes);
     }
   });
 },

 // Helper method for handling cached data
 async getWithExpiry(key, expiryHours = 24) {
   const stored = await this.get(key);
   if (!stored) return null;

   const { value, timestamp } = stored;
   const now = new Date().getTime();
   const expiryTime = expiryHours * 60 * 60 * 1000;

   if (now - timestamp > expiryTime) {
     await this.remove(key);
     return null;
   }

   return value;
 },

 // Store data with expiration
 async setWithExpiry(key, value, expiryHours = 24) {
   const data = {
     value,
     timestamp: new Date().getTime()
   };
   await this.set(key, data);
 }
};</document_content>
</document>

<document>
<source>./src/services/api/authApi.js</source>
<document_content>
// TODO: Implement authApi

export const authApi = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/services/api/promptApi.js</source>
<document_content>
// TODO: Implement promptApi

export const promptApi = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/services/api/llmApi.js</source>
<document_content>
// TODO: Implement llmApi

export const llmApi = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/extension/background/background.js</source>
<document_content>
// TODO: Implement background

export const background = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/extension/content/pageUtils.js</source>
<document_content>
// TODO: Implement pageUtils

export const pageUtils = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/extension/content/contentScript.js</source>
<document_content>
// TODO: Implement contentScript

export const contentScript = {
  // Add service methods
};
</document_content>
</document>

<document>
<source>./src/popup.js</source>
<document_content>
</document_content>
</document>

<document>
<source>./tailwind.config.js</source>
<document_content>
/** @type {import('tailwindcss').Config} */
export default {
 darkMode: ["class"],
 content: [
   './src/**/*.{js,jsx,ts,tsx}',
 ],
 theme: {
   container: {
     center: true,
     padding: "2rem",
     screens: {
       "2xl": "1400px",
     },
   },
   extend: {
     colors: {
       border: "hsl(var(--border))",
       input: "hsl(var(--input))",
       ring: "hsl(var(--ring))",
       background: "hsl(var(--background))",
       foreground: "hsl(var(--foreground))",
       primary: {
         DEFAULT: "hsl(var(--primary))",
         foreground: "hsl(var(--primary-foreground))",
       },
       secondary: {
         DEFAULT: "hsl(var(--secondary))",
         foreground: "hsl(var(--secondary-foreground))",
       },
       destructive: {
         DEFAULT: "hsl(var(--destructive))",
         foreground: "hsl(var(--destructive-foreground))",
       },
       muted: {
         DEFAULT: "hsl(var(--muted))",
         foreground: "hsl(var(--muted-foreground))",
       },
       accent: {
         DEFAULT: "hsl(var(--accent))",
         foreground: "hsl(var(--accent-foreground))",
       },
       popover: {
         DEFAULT: "hsl(var(--popover))",
         foreground: "hsl(var(--popover-foreground))",
       },
       card: {
         DEFAULT: "hsl(var(--card))",
         foreground: "hsl(var(--card-foreground))",
       },
     },
     borderRadius: {
       lg: "var(--radius)",
       md: "calc(var(--radius) - 2px)",
       sm: "calc(var(--radius) - 4px)",
     },
     keyframes: {
       "accordion-down": {
         from: { height: "0" },
         to: { height: "var(--radix-accordion-content-height)" },
       },
       "accordion-up": {
         from: { height: "var(--radix-accordion-content-height)" },
         to: { height: "0" },
       },
       "slide-up-fade": {
         "0%": { opacity: "0", transform: "translateY(6px)" },
         "100%": { opacity: "1", transform: "translateY(0)" },
       },
       "slide-down-fade": {
         "0%": { opacity: "0", transform: "translateY(-6px)" },
         "100%": { opacity: "1", transform: "translateY(0)" },
       },
       "slide-left-fade": {
         "0%": { opacity: "0", transform: "translateX(6px)" },
         "100%": { opacity: "1", transform: "translateX(0)" },
       },
       "slide-right-fade": {
         "0%": { opacity: "0", transform: "translateX(-6px)" },
         "100%": { opacity: "1", transform: "translateX(0)" },
       },
       spotlight: {
         "0%": {
           opacity: "0",
           transform: "translate(-72%, -62%) scale(0.5)",
         },
         "100%": {
           opacity: "1",
           transform: "translate(-50%,-40%) scale(1)",
         },
       },
     },
     animation: {
       "accordion-down": "accordion-down 0.2s ease-out",
       "accordion-up": "accordion-up 0.2s ease-out",
       "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
       "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
       "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
       "slide-right-fade": "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
       spotlight: "spotlight 2s ease .75s 1 forwards",
     },
   },
 },
 plugins: [
   require("tailwindcss-animate"),
 ],
}</document_content>
</document>

</documents>
