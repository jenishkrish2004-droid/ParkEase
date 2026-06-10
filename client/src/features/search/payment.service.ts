import { apiClient } from '@/lib/api-client';

export const createPaymentOrder = async (bookingId: string) => {
  const response = await apiClient.post('/payments/create-order', { bookingId });
  return response.data.data.order;
};

export const verifyPayment = async (data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  const response = await apiClient.post('/payments/verify', data);
  return response.data;
};
