import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

export async function getOwnerMetrics(userId: string) {
  const owner = await prisma.ownerProfile.findUnique({
    where: { userId },
  });

  if (!owner) {
    throw new AppError('Owner profile not found', 404);
  }

  // Active listings count
  const activeListings = await prisma.parkingSpot.count({
    where: {
      ownerId: owner.id,
      status: 'ACTIVE'
    }
  });

  // Total bookings count for owner's spots
  const totalBookings = await prisma.booking.count({
    where: {
      parkingSpot: {
        ownerId: owner.id
      }
    }
  });

  // Calculate monthly earnings (completed bookings in current month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyBookings = await prisma.booking.findMany({
    where: {
      parkingSpot: {
        ownerId: owner.id
      },
      status: 'COMPLETED',
      endTime: { gte: startOfMonth }
    },
    select: { amount: true }
  });

  const monthlyEarnings = monthlyBookings.reduce((sum, b) => sum + b.amount, 0);

  // Average rating (aggregate across all spots)
  const spotsWithRating = await prisma.parkingSpot.findMany({
    where: {
      ownerId: owner.id,
      totalReviews: { gt: 0 }
    },
    select: {
      averageRating: true,
      totalReviews: true
    }
  });

  let totalRatingSum = 0;
  let totalReviewsCount = 0;

  for (const spot of spotsWithRating) {
    totalRatingSum += spot.averageRating * spot.totalReviews;
    totalReviewsCount += spot.totalReviews;
  }

  const averageRating = totalReviewsCount > 0 ? (totalRatingSum / totalReviewsCount).toFixed(1) : '0.0';

  // Earnings breakdown (mocked "Available for Payout" vs "Upcoming Payouts" logic)
  const availableForPayout = monthlyEarnings * 0.8; // Example logic
  const upcomingPayouts = monthlyEarnings * 0.2; // Example logic

  return {
    activeListings,
    totalBookings,
    monthlyEarnings,
    averageRating,
    earningsBreakdown: {
      availableForPayout,
      upcomingPayouts
    }
  };
}
