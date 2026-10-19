import { sendSuccess } from '../../utils/response.js';
import { reservationsService } from './reservations.service.js';

export const reservationsController = {
  status: async (req, res, next) => {
    try {
      const data = await reservationsService.getStatus();
      return sendSuccess(res, data, 'reservations service status');
    } catch (err) {
      next(err);
    }
  },
};
