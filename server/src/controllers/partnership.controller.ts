import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { evPartnershipApplicationSchema } from '../../../shared/src/validators/ev';
import { AppError } from '../shared/errors/AppError';

export const createEVPartnershipApplication = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const validatedData = evPartnershipApplicationSchema.parse(req.body);

  const application = await prisma.eVPartnershipApplication.create({
    data: {
      userId,
      businessName: validatedData.businessName,
      contactPerson: validatedData.contactPerson,
      phoneNumber: validatedData.phoneNumber,
      emailAddress: validatedData.emailAddress,
      stationName: validatedData.stationName,
      fullAddress: validatedData.fullAddress,
      googleMapsLocation: validatedData.googleMapsLocation,
      numberOfPoints: validatedData.numberOfPoints,
      connectorTypes: validatedData.connectorTypes,
      chargingSpeedKw: validatedData.chargingSpeedKw,
      operatingHours: validatedData.operatingHours,
      parkingAvailable: validatedData.parkingAvailable,
      amenities: validatedData.amenities,
      additionalNotes: validatedData.additionalNotes,
    },
  });

  res.status(201).json({
    message: 'EV Partnership Application submitted successfully',
    data: application,
  });
};
