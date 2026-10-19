import { logger } from '../utils/logger.js';

export const initBackgroundJobs = () => {
  logger.info('[Jobs] Background job runner initialized');
  // Scheduled tasks (OTP expiry cleanup, reservation expiry, reminder emails)
  // will be registered during their respective domain implementation phases.
};
