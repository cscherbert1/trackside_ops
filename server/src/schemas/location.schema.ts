import { z } from 'zod';

export const LocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  layoutId: z.number(),
  isSwitching: z.boolean(), 
  isClassification: z.boolean(), 
  isStaging: z.boolean()
  
});

export type LayoutInput = z.infer<typeof LocationSchema>;
