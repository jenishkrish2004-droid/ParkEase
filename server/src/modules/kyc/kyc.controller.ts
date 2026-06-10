import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';
import * as kycService from './kyc.service';
import { SaveDraftInput, SubmitKycInput } from './kyc.schema';

export async function getStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const profile = await kycService.getKycStatus(userId);
    sendSuccess(res, { profile });
  } catch (error) {
    next(error);
  }
}

export async function saveDraftHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const input = req.body as SaveDraftInput;
    const profile = await kycService.saveDraft(userId, input);
    sendSuccess(res, { profile, message: 'Draft saved successfully' });
  } catch (error) {
    next(error);
  }
}

export async function submitKycHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const input = req.body as SubmitKycInput;
    const profile = await kycService.submitKyc(userId, input);
    sendSuccess(res, { profile, message: 'KYC submitted successfully and is under review' });
  } catch (error) {
    next(error);
  }
}

export async function uploadDocumentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    
    const { uploadToCloudinary } = await import('../upload/upload.service');
    const result = await uploadToCloudinary(req.file.buffer, 'parkora/kyc');
    
    sendSuccess(res, { url: result.url, message: 'File uploaded successfully' });
  } catch (error) {
    next(error);
  }
}
