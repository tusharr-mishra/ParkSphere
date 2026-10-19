import { sendSuccess } from '../../utils/response.js';
import { adminService } from './admin.service.js';

export const adminController = {
  status: async (req, res, next) => {
    try {
      const data = await adminService.getStatus();
      return sendSuccess(res, data, 'admin service status');
    } catch (err) {
      next(err);
    }
  },
};
