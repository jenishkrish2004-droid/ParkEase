import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors';
import { SaveDraftInput, SubmitKycInput } from './kyc.schema';

export async function getKycStatus(userId: string) {
  let profile = await prisma.kycProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.kycProfile.create({
      data: {
        userId,
        status: 'NOT_STARTED',
      },
    });
  }

  return profile;
}

export async function saveDraft(userId: string, input: SaveDraftInput) {
  const profile = await prisma.kycProfile.upsert({
    where: { userId },
    update: {
      ...input,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      status: 'DRAFT',
    },
    create: {
      userId,
      ...input,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      status: 'DRAFT',
    },
  });

  return profile;
}

export async function submitKyc(userId: string, input: SubmitKycInput) {
  const profile = await prisma.kycProfile.upsert({
    where: { userId },
    update: {
      ...input,
      dateOfBirth: new Date(input.dateOfBirth),
      status: 'UNDER_REVIEW', // Automatically transition to UNDER_REVIEW
    },
    create: {
      userId,
      ...input,
      dateOfBirth: new Date(input.dateOfBirth),
      status: 'UNDER_REVIEW',
    },
  });

  // Update User verificationStatus if needed, or wait for admin approval
  await prisma.user.update({
    where: { id: userId },
    data: { verificationStatus: 'UNDER_REVIEW' }
  });

  return profile;
}
