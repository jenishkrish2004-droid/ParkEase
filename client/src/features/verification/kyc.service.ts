import { apiClient } from '@/lib/api-client';

export type KycStatus = 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface KycProfile {
  id: string;
  userId: string;
  fullName: string | null;
  dateOfBirth: string | null;
  aadhaarNumber: string | null;
  panNumber: string | null;
  aadhaarUrl: string | null;
  panUrl: string | null;
  status: KycStatus;
  rejectionReason: string | null;
}

export const getKycStatus = async (): Promise<KycProfile> => {
  const response = await apiClient.get('/kyc/status');
  return response.data.data.profile;
};

export const saveKycDraft = async (data: Partial<KycProfile>): Promise<KycProfile> => {
  const response = await apiClient.post('/kyc/draft', data);
  return response.data.data.profile;
};

export const submitKyc = async (data: Partial<KycProfile>): Promise<KycProfile> => {
  const response = await apiClient.post('/kyc/submit', data);
  return response.data.data.profile;
};

export const uploadKycDocument = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/kyc/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data.url;
};
