import { z } from 'zod';
import { SpotStatus } from '@prisma/client';

export const createParkingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(6),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  pricePerHour: z.number().min(0).nullable().optional(),
  pricePerDay: z.number().min(0).nullable().optional(),
  pricePerMonth: z.number().min(0).nullable().optional(),
  totalSlots: z.number().int().min(1),
  amenities: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.string()).optional(),
  status: z.nativeEnum(SpotStatus).optional(),
  image: z.object({
    url: z.string().url(),
    publicId: z.string(),
  }).optional(),
});

export type CreateParkingInput = z.infer<typeof createParkingSchema>;
