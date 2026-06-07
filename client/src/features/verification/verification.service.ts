import { apiClient } from '@/lib/api-client';

export interface VerificationStatusResponse {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

export const getVerificationStatus = async (): Promise<VerificationStatusResponse> => {
  const response = await apiClient.get('/verification/status');
  return response.data.data;
};

export const sendOtp = async (type: 'EMAIL' | 'PHONE', target?: string): Promise<void> => {
  await apiClient.post('/verification/send-otp', { type, target });
};

export const verifyOtp = async (type: 'EMAIL' | 'PHONE', otp: string): Promise<VerificationStatusResponse> => {
  const response = await apiClient.post('/verification/verify-otp', { type, otp });
  return response.data.data;
};
