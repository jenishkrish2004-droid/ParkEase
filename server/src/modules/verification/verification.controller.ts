import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as verificationService from './verification.service';
import { sendSuccess } from '@/shared/utils/response';

// schemas
const sendOtpSchema = z.object({
  type: z.enum(['EMAIL', 'PHONE']),
  target: z.string().optional().refine(val => {
    if (!val) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\+?[1-9]\d{9,14}$/.test(val);
  }, 'Invalid email or phone number format'),
});

const verifyOtpSchema = z.object({
  type: z.enum(['EMAIL', 'PHONE']),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await verificationService.getVerificationStatus(req.user!.id);
    sendSuccess(res, status);
  } catch (err) {
    next(err);
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, target } = sendOtpSchema.parse(req.body);
    const result = await verificationService.sendOtp(req.user!.id, type, target);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, otp } = verifyOtpSchema.parse(req.body);
    const result = await verificationService.verifyOtp(req.user!.id, type, otp);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
