import { sendSuccess } from '../../utils/response.js';
import { paymentsService } from './payments.service.js';

export const paymentsController = {
  status: async (req, res, next) => {
    try {
      const data = await paymentsService.getStatus();
      return sendSuccess(res, data, 'payments service status');
    } catch (err) {
      next(err);
    }
  },
};
