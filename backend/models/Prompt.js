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

export default Prompt;