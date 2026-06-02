import { z } from 'zod';
import { ALL_AMENITIES } from '../constants/amenities';
import { ALL_VEHICLE_TYPES } from '../constants/vehicleTypes';

// ============================================================
// Parking Spot Validators
// ============================================================

export const createParkingSpotSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  pricePerHour: z.number().positive('Price must be positive').optional(),
  pricePerDay: z.number().positive('Price must be positive').optional(),
  pricePerMonth: z.number().positive('Price must be positive').optional(),
  totalSlots: z.number().int().positive('Total slots must be at least 1'),
  amenities: z.array(z.enum(ALL_AMENITIES as [string, ...string[]])).optional(),
  vehicleTypes: z
    .array(z.enum(ALL_VEHICLE_TYPES as [string, ...string[]]))
    .min(1, 'At least one vehicle type is required'),
});

export const updateParkingSpotSchema = createParkingSpotSchema.partial();

export const searchParkingSpotsSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().max(50).optional(), // km
  amenities: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.string()).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  sortBy: z.enum(['price', 'rating', 'distance', 'newest']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// ============================================================
// Inferred Types
// ============================================================

export type CreateParkingSpotInput = z.infer<typeof createParkingSpotSchema>;
export type UpdateParkingSpotInput = z.infer<typeof updateParkingSpotSchema>;
export type SearchParkingSpotsInput = z.infer<typeof searchParkingSpotsSchema>;
