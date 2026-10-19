import { z } from 'zod';

export const reviewsValidation = {
  statusQuery: z.object({}).optional(),
};
