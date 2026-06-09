import { EmptyState } from '@/components/ui/EmptyState';

export default function OwnerBookings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight">Bookings</h1>
          <p className="text-secondary-500 dark:text-[#d0c5af] mt-2">Track upcoming, active, and past bookings for your spots.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
        <div className="flex space-x-2 border-b border-secondary-200 dark:border-[#4d4635] mb-8 overflow-x-auto pb-2">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-600 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50] transition-colors">Upcoming</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Active</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Completed</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Cancelled</button>
        </div>

        <EmptyState
          title="No bookings yet"
          description="You don't have any bookings for your parking spots right now."
        />
      </div>
    </div>
  );
}
