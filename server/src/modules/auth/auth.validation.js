import { z } from 'zod';

export const authValidation = {
  statusQuery: z.object({}).optional(),
};
