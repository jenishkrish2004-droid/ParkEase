import { prisma } from '../../config/database';
import { CreateParkingInput } from './parking.schema';
import { AppError } from '../../shared/errors/AppError';

export async function createParkingSpot(ownerUserId: string, data: CreateParkingInput) {
  // Get owner profile
  const owner = await prisma.ownerProfile.findUnique({
    where: { userId: ownerUserId },
  });

  if (!owner) {
    throw new AppError('Owner profile not found. Please complete verification.', 403);
  }

  // Create the spot
  const spot = await prisma.parkingSpot.create({
    data: {
      ownerId: owner.id,
      title: data.title,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
      pricePerHour: data.pricePerHour || null,
      pricePerDay: data.pricePerDay || null,
      pricePerMonth: data.pricePerMonth || null,
      totalSlots: data.totalSlots,
      availableSlots: data.totalSlots, // Initially all slots available
      status: data.status || 'ACTIVE',
      // Store amenities and vehicleTypes properly
      amenities: data.amenities?.length ? {
        create: data.amenities.map(a => ({ amenity: a as any }))
      } : undefined,
      vehicleTypes: data.vehicleTypes?.length ? {
        create: data.vehicleTypes.map(v => ({ vehicleType: v as any }))
      } : undefined,
      images: data.image ? {
        create: [{
          url: data.image.url,
          publicId: data.image.publicId,
          isPrimary: true,
          sortOrder: 0,
        }]
      } : undefined,
    },
    include: {
      images: true,
      amenities: true,
      vehicleTypes: true,
    }
  });

  return spot;
}

export async function getOwnerSpots(ownerUserId: string) {
  const owner = await prisma.ownerProfile.findUnique({
    where: { userId: ownerUserId },
  });

  if (!owner) {
    return [];
  }

  return prisma.parkingSpot.findMany({
    where: { ownerId: owner.id },
    include: {
      images: true,
      amenities: true,
      vehicleTypes: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function searchParkingSpots(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  
  // Basic search matching city, state, or address
  return prisma.parkingSpot.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { city: { contains: normalizedQuery, mode: 'insensitive' } },
        { address: { contains: normalizedQuery, mode: 'insensitive' } },
        { title: { contains: normalizedQuery, mode: 'insensitive' } }
      ]
    },
    include: {
      images: true,
      amenities: true,
      vehicleTypes: true,
    },
    orderBy: { averageRating: 'desc' },
    take: 20
  });
}
