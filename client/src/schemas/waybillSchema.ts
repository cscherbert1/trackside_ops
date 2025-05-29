// client/schemas/waybillSchema.ts
import { z } from 'zod';

export const InstructionSchema = z.object({
  commodityId: z.number({
    required_error: 'Commodity is required',
    invalid_type_error: 'Commodity must be selected'
  }),
  locationId: z.number({
    required_error: 'Location is required',
    invalid_type_error: 'Location must be selected'
  }),
  trackId: z.number().optional(),
  tat: z.string().min(1, 'TAT is required'),
  specialInstructions: z.string().max(64, 'Maximum length is 64 characters').optional(),
  sequence: z.number().optional(),
});

export const WaybillSchema = z.object({
  id: z.number().optional(),
  carType: z.string().min(1, 'Car Type is required'),
  repeating: z.boolean(),
  rareWaybill: z.boolean(),
  currentSequence: z.number().min(1),
  layoutId: z.number(),
  instructions: z.array(InstructionSchema)
    .min(2, 'At least 2 instructions are required')
    .max(6, 'No more than 6 instructions are allowed'),
});

export type WaybillInput = z.infer<typeof WaybillSchema>;
export const instructionsArraySchema = z.array(InstructionSchema);
export type InstructionFormData = z.infer<typeof instructionsArraySchema>;
