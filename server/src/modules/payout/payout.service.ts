import { PrismaClient, OwnerPayoutAccount, PayoutStatus } from '@prisma/client';
import { SavePayoutInput } from './payout.schema';

const prisma = new PrismaClient();

export const getPayoutAccount = async (userId: string): Promise<OwnerPayoutAccount | null> => {
  return prisma.ownerPayoutAccount.findUnique({
    where: { userId },
  });
};

export const upsertPayoutAccount = async (userId: string, data: SavePayoutInput): Promise<OwnerPayoutAccount> => {
  return prisma.ownerPayoutAccount.upsert({
    where: { userId },
    update: {
      accountHolderName: data.accountHolderName,
      payoutMethod: data.payoutMethod,
      bankName: data.payoutMethod === 'BANK' ? data.bankName : null,
      accountNumber: data.payoutMethod === 'BANK' ? data.accountNumber : null,
      ifscCode: data.payoutMethod === 'BANK' ? data.ifscCode : null,
      upiId: data.payoutMethod === 'UPI' ? data.upiId : null,
      status: PayoutStatus.CONFIGURED, // Automatically mark as configured
      isVerified: false, // Wait for admin/system verification
    },
    create: {
      userId,
      accountHolderName: data.accountHolderName,
      payoutMethod: data.payoutMethod,
      bankName: data.payoutMethod === 'BANK' ? data.bankName : null,
      accountNumber: data.payoutMethod === 'BANK' ? data.accountNumber : null,
      ifscCode: data.payoutMethod === 'BANK' ? data.ifscCode : null,
      upiId: data.payoutMethod === 'UPI' ? data.upiId : null,
      status: PayoutStatus.CONFIGURED,
      isVerified: false,
    },
  });
};
