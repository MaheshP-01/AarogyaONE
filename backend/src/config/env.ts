import dotenv from 'dotenv';
import path from 'path';

// Load .env file from backend root or workspace root
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.BACKEND_PORT || process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ruralcare_connect',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
};
