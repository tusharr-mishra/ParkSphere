import { sendSuccess } from '../../utils/response.js';
import { analyticsService } from './analytics.service.js';

export const analyticsController = {
  status: async (req, res, next) => {
    try {
      const data = await analyticsService.getStatus();
      return sendSuccess(res, data, 'analytics service status');
    } catch (err) {
      next(err);
    }
  },
};
