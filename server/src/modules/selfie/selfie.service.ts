import { PrismaClient, SelfieVerification, SelfieStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getSelfie = async (userId: string): Promise<SelfieVerification | null> => {
  return prisma.selfieVerification.findUnique({
    where: { userId },
  });
};

export const upsertSelfie = async (userId: string, imageUrl: string): Promise<SelfieVerification> => {
  return prisma.selfieVerification.upsert({
    where: { userId },
    update: {
      imageUrl,
      status: SelfieStatus.UNDER_REVIEW,
      submittedAt: new Date(),
    },
    create: {
      userId,
      imageUrl,
      status: SelfieStatus.UNDER_REVIEW,
      submittedAt: new Date(),
    },
  });
};
