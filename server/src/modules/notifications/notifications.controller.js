import { sendSuccess } from '../../utils/response.js';
import { notificationsService } from './notifications.service.js';

export const notificationsController = {
  status: async (req, res, next) => {
    try {
      const data = await notificationsService.getStatus();
      return sendSuccess(res, data, 'notifications service status');
    } catch (err) {
      next(err);
    }
  },
};
