import { z } from 'zod';

export const parkingValidation = {
  statusQuery: z.object({}).optional(),
};
