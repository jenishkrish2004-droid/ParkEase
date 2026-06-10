import { prisma } from '../../config/database';
import { CreateBookingInput } from './booking.schema';
import { AppError } from '../../shared/errors/AppError';

export async function createBooking(userId: string, data: CreateBookingInput) {
  const spot = await prisma.parkingSpot.findUnique({
    where: { id: data.parkingSpotId }
  });

  if (!spot) {
    throw new AppError('Parking spot not found', 404);
  }

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.ceil(durationMs / 60000);

  if (durationMinutes <= 0) {
    throw new AppError('End time must be after start time', 400);
  }

  // Calculate price (simplified based on hourly rate)
  const ratePerHour = spot.pricePerHour || 50;
  const amount = (durationMinutes / 60) * ratePerHour;
  const platformFee = amount * 0.1; // 10% platform fee
  const totalAmount = amount + platformFee;

  // Simple availability check: Don't allow if current active bookings >= total slots
  // A proper query would check overlapping times, but this is a simplified Phase 5 approach.
  const activeBookings = await prisma.booking.count({
    where: {
      parkingSpotId: spot.id,
      status: { in: ['CONFIRMED', 'ACTIVE'] },
      startTime: { lt: end },
      endTime: { gt: start }
    }
  });

  if (activeBookings >= spot.totalSlots) {
    throw new AppError('Parking spot is fully booked for this time period', 400);
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      parkingSpotId: spot.id,
      vehicleType: data.vehicleType as any,
      vehicleNumber: data.vehicleNumber,
      startTime: start,
      endTime: end,
      duration: durationMinutes,
      amount,
      platformFee,
      totalAmount,
      status: 'PENDING'
    }
  });

  return booking;
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      parkingSpot: true,
      payment: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getUserDashboardMetrics(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    select: { amount: true, status: true, totalAmount: true }
  });

  const totalBookings = bookings.length;
  // Compute total spent on completed/active bookings
  const totalSpent = bookings
    .filter(b => ['COMPLETED', 'ACTIVE', 'CONFIRMED'].includes(b.status))
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return {
    totalBookings,
    totalSpent
  };
}
