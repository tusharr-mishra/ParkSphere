import { z } from 'zod';

export const auditLogsValidation = {
  statusQuery: z.object({}).optional(),
};
