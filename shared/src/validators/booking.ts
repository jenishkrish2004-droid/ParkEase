import { z } from 'zod';
import { ALL_VEHICLE_TYPES } from '../constants/vehicleTypes';

// ============================================================
// Booking Validators
// ============================================================

export const createBookingSchema = z.object({
  parkingSpotId: z.string().min(1, 'Parking spot is required'),
  vehicleType: z.enum(ALL_VEHICLE_TYPES as [string, ...string[]]),
  vehicleNumber: z
    .string()
    .min(1, 'Vehicle number is required')
    .max(20)
    .regex(/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/i, 'Invalid vehicle number format'),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
});

export const cancelBookingSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required').max(500),
});

// ============================================================
// Inferred Types
// ============================================================

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
