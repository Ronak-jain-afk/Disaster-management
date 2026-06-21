import http from 'http';
import app from './app';
import config from './config';
import connectDB from './config/db';
import { initializeSocket } from './services/socketManager';

const start = async (): Promise<void> => {
  await connectDB();

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

start();
