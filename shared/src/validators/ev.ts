import { z } from 'zod';

export const evPartnershipApplicationSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit phone number is required'),
  emailAddress: z.string().email('Invalid email address'),
  
  stationName: z.string().min(2, 'Station name is required'),
  fullAddress: z.string().min(5, 'Full address is required'),
  googleMapsLocation: z.string().url('Must be a valid URL').or(z.string().min(5)),
  numberOfPoints: z.number().int().min(1, 'Must have at least 1 charging point'),
  connectorTypes: z.array(z.string()).min(1, 'Select at least one connector type'),
  chargingSpeedKw: z.number().positive('Charging speed must be positive'),
  operatingHours: z.string().min(2, 'Operating hours are required'),
  
  parkingAvailable: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
});

export type EVPartnershipApplicationPayload = z.infer<typeof evPartnershipApplicationSchema>;
