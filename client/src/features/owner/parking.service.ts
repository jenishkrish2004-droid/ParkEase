import { apiClient } from '@/lib/api-client';
import type { IParkingSpotDetail } from '@parkora/shared';

export const createParkingSpot = async (data: any): Promise<IParkingSpotDetail> => {
  const response = await apiClient.post('/parking-spots', data);
  return response.data.data.spot;
};

export const getOwnerSpots = async (): Promise<IParkingSpotDetail[]> => {
  const response = await apiClient.get('/parking-spots/owner');
  return response.data.data.spots;
};

export const uploadSpotImage = async (file: File): Promise<{url: string, publicId: string}> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/parking-spots/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};
