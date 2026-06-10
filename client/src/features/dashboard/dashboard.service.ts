import { apiClient } from '@/lib/api-client';

export const getUserDashboardMetrics = async () => {
  const response = await apiClient.get('/bookings/dashboard-metrics');
  return response.data.data.metrics;
};
