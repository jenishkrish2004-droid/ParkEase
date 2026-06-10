import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';
import * as parkingService from './parking.service';
import { createParkingSchema } from './parking.schema';

export async function createSpotHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const input = createParkingSchema.parse(req.body);
    const spot = await parkingService.createParkingSpot(userId, input);
    sendSuccess(res, { spot, message: 'Parking spot created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getOwnerSpotsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const spots = await parkingService.getOwnerSpots(userId);
    sendSuccess(res, { spots });
  } catch (error) {
    next(error);
  }
}

export async function searchSpotsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = (req.query.q as string) || '';
    const spots = await parkingService.searchParkingSpots(query);
    sendSuccess(res, { spots });
  } catch (error) {
    next(error);
  }
}

export async function uploadSpotImageHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image uploaded' });
      return;
    }
    
    const { uploadToCloudinary } = await import('../upload/upload.service');
    const result = await uploadToCloudinary(req.file.buffer, 'parkora/spots');
    
    // Client will receive URL and attach it to the spot creation or update it later
    sendSuccess(res, { url: result.url, publicId: result.publicId, message: 'Image uploaded successfully' });
  } catch (error) {
    next(error);
  }
}
