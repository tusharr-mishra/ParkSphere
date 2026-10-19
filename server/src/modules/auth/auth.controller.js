import { sendSuccess } from '../../utils/response.js';
import { authService } from './auth.service.js';

export const authController = {
  status: async (req, res, next) => {
    try {
      const data = await authService.getStatus();
      return sendSuccess(res, data, 'auth service status');
    } catch (err) {
      next(err);
    }
  },
};
