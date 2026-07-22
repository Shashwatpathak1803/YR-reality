import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
  JWT_COOKIE_EXPIRES_DAYS: Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7),

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '30d',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3001',

  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 200),

  // ✅ SMTP Configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
};

const required = ['MONGODB_URI', 'JWT_SECRET'];

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
  }
}