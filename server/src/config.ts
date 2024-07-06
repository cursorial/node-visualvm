import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3002",
  UPDATE_INTERVAL: Number(process.env.UPDATE_INTERVAL) || 1000,
};
