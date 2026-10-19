import { z } from 'zod';

export const adminValidation = {
  statusQuery: z.object({}).optional(),
};
