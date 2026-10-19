import { z } from 'zod';

export const slotsValidation = {
  statusQuery: z.object({}).optional(),
};
