import { z } from 'zod';

export const paymentsValidation = {
  statusQuery: z.object({}).optional(),
};
