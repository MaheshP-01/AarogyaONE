import mongoose from 'mongoose';
import { config } from './env';

/**
 * MongoDB connection helper prepared for RuralCare Connect data layer
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('[Database] Warning: MongoDB connection failed.');
    console.warn(`[Database] Error details: ${(error as Error).message}`);
    console.warn('[Database] The server will continue running for foundation health check & stateless endpoints.');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected cleanly.');
  } catch (error) {
    console.error('[Database] Error during disconnection:', error);
  }
};
