import { z } from 'zod';

export const LocationSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  layoutId: z.number(),
  isSwitching: z.boolean(), 
  isClassification: z.boolean(), 
  isStaging: z.boolean()  
}).refine(
  (data) => data.isSwitching || data.isClassification || data.isStaging,
  {
    message: "At least one location type must be selected",
    path: ["isSwitching"], // this makes error handling easier — you can use any field
  }
);

export type LayoutInput = z.infer<typeof LocationSchema>;
