import { Request, Response, NextFunction } from 'express';
import * as selfieService from './selfie.service';
import { AppError } from '../../shared/errors/AppError';

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

    const { uploadToCloudinary } = await import('../upload/upload.service');
    const result = await uploadToCloudinary(req.file.buffer, 'parkora/selfies');
    
    const selfie = await selfieService.upsertSelfie(userId, result.url);
    
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
