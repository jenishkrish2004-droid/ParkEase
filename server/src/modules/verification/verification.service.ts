import { PrismaClient } from '@prisma/client';
import { VerificationStatus } from '@parkora/shared';
import crypto from 'crypto';
import { prisma } from '@/config/database';
import { AppError } from '@/shared/errors/AppError';

// Helper to generate a 6 digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getVerificationStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: true,
    },
  });

  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const sendOtp = async (userId: string, type: 'EMAIL' | 'PHONE', reqTarget?: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  if (type === 'EMAIL' && user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }
  if (type === 'PHONE' && user.isPhoneVerified) {
    throw new AppError('Phone is already verified', 400);
  }

  const destination = reqTarget || (type === 'EMAIL' ? user.email : user.phone);
  if (!destination) {
    throw new AppError(`User does not have a ${type.toLowerCase()} set`, 400);
  }

  // Generate OTP
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Hash OTP for DB
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  // Invalidate previous active OTPs
  await prisma.verificationOtp.updateMany({
    where: { userId, type, isUsed: false },
    data: { isUsed: true },
  });

  // Save new OTP
  await prisma.verificationOtp.create({
    data: {
      userId,
      type,
      target: reqTarget || null,
      otpHash,
      expiresAt,
    },
  });

  // Mock send OTP (in production, integrate with email/SMS provider)
  console.log(`\n================================`);
  console.log(`[MOCK OTP] Type: ${type}`);
  console.log(`[MOCK OTP] User: ${destination}`);
  console.log(`[MOCK OTP] Code: ${otp}`);
  console.log(`================================\n`);

  return { message: `${type === 'EMAIL' ? 'Email' : 'Phone'} OTP sent successfully` };
};

export const verifyOtp = async (userId: string, type: 'EMAIL' | 'PHONE', otp: string) => {
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  const record = await prisma.verificationOtp.findFirst({
    where: {
      userId,
      type,
      otpHash,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  // Invalidate OTP
  await prisma.verificationOtp.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const updateData: any = {};
  if (type === 'EMAIL') {
    updateData.isEmailVerified = true;
    if (record.target) {
      updateData.email = record.target;
    }
  } else {
    updateData.isPhoneVerified = true;
    if (record.target) {
      updateData.phone = record.target;
    }
  }

  if (user?.verificationStatus === VerificationStatus.PENDING) {
    updateData.verificationStatus = VerificationStatus.UNDER_REVIEW;
  }
  // If this step completes both verifications, update overall status
  const willEmailBeVerified = type === 'EMAIL' || user?.isEmailVerified;
  const willPhoneBeVerified = type === 'PHONE' || user?.isPhoneVerified;

  if (willEmailBeVerified && willPhoneBeVerified) {
    updateData.verificationStatus = VerificationStatus.APPROVED;
  } else if (user?.verificationStatus === VerificationStatus.PENDING) {
    updateData.verificationStatus = VerificationStatus.UNDER_REVIEW;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationStatus: true,
    },
  });

  return updatedUser;
};
