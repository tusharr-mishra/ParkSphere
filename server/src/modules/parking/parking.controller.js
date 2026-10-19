import { sendSuccess } from '../../utils/response.js';
import { parkingService } from './parking.service.js';

export const parkingController = {
  status: async (req, res, next) => {
    try {
      const data = await parkingService.getStatus();
      return sendSuccess(res, data, 'parking service status');
    } catch (err) {
      next(err);
    }
  },
};
