import { apiClient } from '@/lib/api-client';

export type PayoutMethod = 'BANK' | 'UPI';
export type PayoutStatus = 'NOT_CONFIGURED' | 'CONFIGURED' | 'VERIFIED' | 'REJECTED';

export interface OwnerPayoutAccount {
  id: string;
  userId: string;
  accountHolderName: string;
  payoutMethod: PayoutMethod;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  upiId: string | null;
  status: PayoutStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getPayoutAccount = async (): Promise<OwnerPayoutAccount | null> => {
  const response = await apiClient.get('/owner/payout');
  return response.data.data.account;
};

export const savePayoutAccount = async (data: Partial<OwnerPayoutAccount>): Promise<OwnerPayoutAccount> => {
  const response = await apiClient.post('/owner/payout/save', data);
  return response.data.data.account;
};
