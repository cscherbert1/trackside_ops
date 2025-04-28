import { z } from 'zod';

export const TrackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  locationId: z.number(),
  trackLength: z.number(), 
  isOffSpotAvailable: z.boolean()
  
});

export type TrackInput = z.infer<typeof TrackSchema>;
