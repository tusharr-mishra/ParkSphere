import { sendSuccess } from '../../utils/response.js';
import { auditLogsService } from './auditLogs.service.js';

export const auditLogsController = {
  status: async (req, res, next) => {
    try {
      const data = await auditLogsService.getStatus();
      return sendSuccess(res, data, 'auditLogs service status');
    } catch (err) {
      next(err);
    }
  },
};
