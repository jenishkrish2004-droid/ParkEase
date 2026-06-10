import { z } from 'zod';

export const createBookingSchema = z.object({
  parkingSpotId: z.string(),
  vehicleType: z.enum(['CAR', 'BIKE', 'EV']),
  vehicleNumber: z.string().min(4),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
