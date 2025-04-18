import { z } from 'zod';

export const LayoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type LayoutInput = z.infer<typeof LayoutSchema>;
