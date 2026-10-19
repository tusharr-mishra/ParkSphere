import { sendSuccess } from '../../utils/response.js';
import { reviewsService } from './reviews.service.js';

export const reviewsController = {
  status: async (req, res, next) => {
    try {
      const data = await reviewsService.getStatus();
      return sendSuccess(res, data, 'reviews service status');
    } catch (err) {
      next(err);
    }
  },
};
