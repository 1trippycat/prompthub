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

export default dbConfig;