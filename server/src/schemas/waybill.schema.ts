import { z } from 'zod';
import { InstructionSchema } from './instruction.schema';

export const WaybillSchema = z.object({
  layoutId: z.number(),
  carType: z.string().min(3, 'Car Type must be >= 3 characters'),
  repeating: z.boolean(),
  rareWaybill: z.boolean(),
  instructions: z.array(InstructionSchema).min(2),
});

export type WaybillInput = z.infer<typeof WaybillSchema>;