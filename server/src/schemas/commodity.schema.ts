import { z } from 'zod';

export const CommoditySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  layoutId: z.number(),
});

export type CommodityInput = z.infer<typeof CommoditySchema>;
