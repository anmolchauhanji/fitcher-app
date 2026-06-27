import dotenv from 'dotenv';
dotenv.config();

 const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  DATABASE_URL: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN|| '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
}

export default env