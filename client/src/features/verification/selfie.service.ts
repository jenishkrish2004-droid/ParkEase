import { apiClient } from '@/lib/api-client';

export type SelfieStatus = 'NOT_SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface SelfieVerification {
  id: string;
  userId: string;
  imageUrl: string | null;
  status: SelfieStatus;
  reviewerNotes: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
}

export const getSelfieStatus = async (): Promise<SelfieVerification | null> => {
  const response = await apiClient.get('/owner/selfie');
  return response.data.data.selfie;
};

export const uploadSelfie = async (file: File): Promise<SelfieVerification> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/owner/selfie/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.selfie;
};
