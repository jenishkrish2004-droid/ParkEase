import { Request, Response, NextFunction } from 'express';
import * as selfieService from './selfie.service';
import { AppError } from '../../middleware/errorHandler';

export const getSelfieHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const selfie = await selfieService.getSelfie(userId);
    
    res.status(200).json({
      success: true,
      data: {
        selfie
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadSelfieHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    // In a real app, you would upload to S3. Here we use local upload path
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const selfie = await selfieService.upsertSelfie(userId, imageUrl);
    
    res.status(200).json({
      success: true,
      message: 'Selfie uploaded successfully and is under review',
      data: {
        selfie
      }
    });
  } catch (error) {
    next(error);
  }
};
