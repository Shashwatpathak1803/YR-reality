import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate Backend API',
      version: '1.0.0',
      description: 'API documentation for the Real Estate Website & Admin Panel backend',
    },
    servers: [{ url: `http://localhost:${env.PORT}/api`, description: 'Local server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
