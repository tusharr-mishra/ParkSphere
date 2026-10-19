import { z } from 'zod';

export const analyticsValidation = {
  statusQuery: z.object({}).optional(),
};
