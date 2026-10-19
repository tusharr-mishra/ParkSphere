import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { initBackgroundJobs } from './jobs/index.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Attempt DB connection (non-fatal in early local dev if DB isn't running yet, but logged)
    try {
      await connectDB();
    } catch (err) {
      logger.warn(`Initial MongoDB connection failed: ${err.message}. Server starting in degraded state.`);
    }

    // Initialize background jobs
    initBackgroundJobs();

    const server = app.listen(ENV.PORT, () => {
      logger.info(`[ParkSphere Server] Running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
    });

    const shutdown = async (signal) => {
      logger.info(`[Server] Received ${signal}, closing server and DB connections...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('[Server] Graceful shutdown complete.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
