import { z } from 'zod';

export const LayoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  description: z.string().trim().optional(),
});

export type LayoutInput = z.infer<typeof LayoutSchema>;
