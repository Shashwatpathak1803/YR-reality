import { env, validateEnv } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';

validateEnv();

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`📚 API Docs available at http://localhost:${env.PORT}/api-docs`);
  });

  // Graceful shutdown & safety nets
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...', err);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

startServer();
