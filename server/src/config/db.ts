import mongoose from 'mongoose';
import config from './index';

const connectDB = async (): Promise<void> => {
  const isPlaceholder = config.mongodbUri.includes('<username>') || config.mongodbUri === 'mongodb://localhost:27017/emergency-alerts';

  if (isPlaceholder) {
    console.log('No real MongoDB URI configured. Starting in-memory MongoDB...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-memory MongoDB connected: ${conn.connection.host}`);
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to in-memory MongoDB...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-memory MongoDB connected: ${conn.connection.host}`);
  }
};

export default connectDB;
