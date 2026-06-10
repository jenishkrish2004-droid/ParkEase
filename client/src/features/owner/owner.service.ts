import { apiClient } from '@/lib/api-client';

export const getOwnerMetrics = async () => {
  const response = await apiClient.get('/owner/dashboard/metrics');
  return response.data.data.metrics;
};
