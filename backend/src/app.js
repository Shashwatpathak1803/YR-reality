import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import apiRoutes from './routes/index.js';
import { UPLOADS_DIR } from './services/media.service.js';

const app = express();

// Security headers (allow /uploads images to be embedded by the website/admin origins)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS: allow the public website and the admin panel
// In development also allow any localhost/127.0.0.1 origin (vite dev servers pick free ports)
const allowedOrigins = [env.CLIENT_URL, env.ADMIN_URL];
const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
app.use(
  cors({
    origin: "*",
  })
);

// Body & cookie parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitize against NoSQL query injection and XSS
app.use(mongoSanitize());
app.use(xss());

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Locally stored uploads (fallback when Cloudinary is not configured)
app.use('/uploads', express.static(UPLOADS_DIR));

// Global rate limiting
app.use('/api', globalLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real Estate Backend API is running...........',
    docs: '/api-docs',
  });
});

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);

export default app;
