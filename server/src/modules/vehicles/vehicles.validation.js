import { z } from 'zod';

export const vehiclesValidation = {
  statusQuery: z.object({}).optional(),
};
