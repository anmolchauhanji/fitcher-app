import dotenv from 'dotenv';
dotenv.config();

const env = {
  NODE_ENV: (process.env.NODE_ENV || 'development').trim(),
  PORT: process.env.PORT || 3000,

  DATABASE_URL: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default env;