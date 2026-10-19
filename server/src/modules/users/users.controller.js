import { sendSuccess } from '../../utils/response.js';
import { usersService } from './users.service.js';

export const usersController = {
  status: async (req, res, next) => {
    try {
      const data = await usersService.getStatus();
      return sendSuccess(res, data, 'users service status');
    } catch (err) {
      next(err);
    }
  },
};
