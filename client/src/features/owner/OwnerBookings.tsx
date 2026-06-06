import { EmptyState } from '@/components/ui/EmptyState';

export default function OwnerBookings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Bookings</h1>
          <p className="text-secondary-500 mt-1">Track upcoming, active, and past bookings for your spots.</p>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-secondary-200 overflow-x-auto">
        <button className="px-4 py-2 text-sm font-semibold text-primary-600 border-b-2 border-primary-600">Upcoming</button>
        <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Active</button>
        <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Completed</button>
        <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Cancelled</button>
      </div>

      <div className="bg-white rounded-2xl border border-secondary-200 p-8">
        <EmptyState
          title="No bookings yet"
          description="You don't have any bookings for your parking spots right now."
        />
      </div>
    </div>
  );
}
