import { z } from 'zod';

export const usersValidation = {
  statusQuery: z.object({}).optional(),
};
