import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES });

export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: env.JWT_COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
};
