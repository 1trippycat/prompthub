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

export default User;