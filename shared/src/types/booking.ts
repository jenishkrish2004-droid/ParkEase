import type { BookingStatus } from '../constants/bookingStatus';
import type { VehicleType } from '../constants/vehicleTypes';

// ============================================================
// Booking
// ============================================================

export interface IBooking {
  id: string;
  userId: string;
  parkingSpotId: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  platformFee: number;
  totalAmount: number;
  status: BookingStatus;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Booking with related spot info for history display */
export interface IBookingWithSpot extends IBooking {
  parkingSpot: {
    id: string;
    title: string;
    address: string;
    city: string;
    primaryImage: string | null;
  };
}
