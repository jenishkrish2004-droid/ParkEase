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

  // Also ensure OwnerProfile exists
  await prisma.ownerProfile.upsert({
    where: { userId },
    update: { status: 'UNDER_REVIEW' },
    create: { userId, status: 'UNDER_REVIEW' },
  });

  // Update User to reflect owner intent
  await prisma.user.update({
    where: { id: userId },
    data: { isOwner: true }
  });

  return profile;
}
