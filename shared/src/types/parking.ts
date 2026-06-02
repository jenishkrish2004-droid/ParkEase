import type { Amenity } from '../constants/amenities';
import type { VehicleType } from '../constants/vehicleTypes';
import type { SpotStatus } from '../constants/bookingStatus';

// ============================================================
// Parking Spot
// ============================================================

export interface IParkingSpot {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  pricePerHour: number | null;
  pricePerDay: number | null;
  pricePerMonth: number | null;
  totalSlots: number;
  availableSlots: number;
  status: SpotStatus;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

/** Parking spot with all relations loaded */
export interface IParkingSpotDetail extends IParkingSpot {
  images: IParkingImage[];
  amenities: Amenity[];
  vehicleTypes: VehicleType[];
  owner: {
    id: string;
    businessName: string | null;
    user: {
      firstName: string;
      lastName: string;
      avatar: string | null;
    };
  };
}

/** Parking spot card for listing pages */
export interface IParkingSpotCard {
  id: string;
  title: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  pricePerHour: number | null;
  pricePerDay: number | null;
  totalSlots: number;
  availableSlots: number;
  averageRating: number;
  totalReviews: number;
  primaryImage: string | null;
  amenities: Amenity[];
  vehicleTypes: VehicleType[];
  distance?: number; // km, computed for nearby searches
}

// ============================================================
// Parking Image
// ============================================================

export interface IParkingImage {
  id: string;
  parkingSpotId: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

// ============================================================
// Availability Slot
// ============================================================

export interface IAvailabilitySlot {
  id: string;
  parkingSpotId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isActive: boolean;
}
