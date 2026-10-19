import { z } from 'zod';

export const reservationsValidation = {
  statusQuery: z.object({}).optional(),
};
