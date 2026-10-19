import { sendSuccess } from '../../utils/response.js';
import { slotsService } from './slots.service.js';

export const slotsController = {
  status: async (req, res, next) => {
    try {
      const data = await slotsService.getStatus();
      return sendSuccess(res, data, 'slots service status');
    } catch (err) {
      next(err);
    }
  },
};
