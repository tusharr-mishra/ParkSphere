import { z } from 'zod';

export const notificationsValidation = {
  statusQuery: z.object({}).optional(),
};
