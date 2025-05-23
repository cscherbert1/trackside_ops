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
  trackId: z.number({
    required_error: 'Track is required',
    invalid_type_error: 'Track must be selected'
  }),
  tat: z.string().min(1, 'TAT is required'),
  specialInstructions: z.string().max(64).optional().nullable(),
  sequence: z.number().optional(), // Will be injected before submit
});

export const WaybillSchema = z.object({
  carType: z.string().min(1, 'Car Type is required'),
  repeating: z.boolean(),
  rareWaybill: z.boolean(),
  currentSequence: z.number().min(1),
  layoutId: z.number(),
  instructions: z.array(InstructionSchema)
    .min(2, 'At least 2 instructions are required')
    .max(6, 'No more than 6 instructions are allowed'),
});
