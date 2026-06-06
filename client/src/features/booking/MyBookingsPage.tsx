import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-secondary-900 mb-6">My Bookings</h1>
        
        {/* Placeholder Tabs */}
        <div className="flex space-x-4 border-b border-secondary-200 mb-6 overflow-x-auto">
          <button className="px-4 py-2 text-sm font-semibold text-primary-600 border-b-2 border-primary-600">Upcoming</button>
          <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Active</button>
          <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Completed</button>
          <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Cancelled</button>
        </div>

        <EmptyState
          title="No upcoming bookings"
          description="You don't have any upcoming parking bookings right now."
          actionLabel="Find Parking"
          onAction={() => navigate('/search')}
        />
      </div>
    </PageLayout>
  );
}
