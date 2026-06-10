import { apiClient } from '@/lib/api-client';

export const createBooking = async (data: any) => {
  const response = await apiClient.post('/bookings', data);
  return response.data.data.booking;
};
