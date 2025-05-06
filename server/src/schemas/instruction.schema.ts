// server/src/schemas/instruction.schema.ts
import { z } from 'zod';

export const InstructionSchema = z.object({
  id: z.number().optional(),
  commodityId: z.number(),
  locationId: z.number(),
  trackId: z.number(),
  tat: z.string(),
  specialInstructions: z.string().max(64).optional().nullable(),
  sequence: z.number().int().min(1),
});

export type InstructionInput = z.infer<typeof InstructionSchema>;
