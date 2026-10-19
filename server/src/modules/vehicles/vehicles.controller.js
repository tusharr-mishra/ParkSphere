import { sendSuccess } from '../../utils/response.js';
import { vehiclesService } from './vehicles.service.js';

export const vehiclesController = {
  status: async (req, res, next) => {
    try {
      const data = await vehiclesService.getStatus();
      return sendSuccess(res, data, 'vehicles service status');
    } catch (err) {
      next(err);
    }
  },
};
