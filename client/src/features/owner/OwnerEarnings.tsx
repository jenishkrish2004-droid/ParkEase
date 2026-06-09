import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function OwnerEarnings() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight">Earnings</h1>
          <p className="text-secondary-500 dark:text-[#d0c5af] mt-2">Overview of your revenue and payouts.</p>
        </div>
        <Button variant="outline" className="border-secondary-300 dark:border-[#4d4635] dark:text-[#eae1d4] dark:hover:bg-white/5" onClick={() => navigate('/owner/reports')}>Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary-50/80 dark:bg-[#f2ca50]/10 surface-glass border border-primary-200 dark:border-[#f2ca50]/20 shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-primary-700 dark:text-[#f2ca50]">Available for Payout</p>
          <p className="text-3xl font-display font-bold text-primary-900 dark:text-[#fceb96] mt-2">₹0.00</p>
          <button disabled className="mt-4 w-full px-6 py-2.5 rounded-xl text-white bg-primary-600/50 dark:bg-[#f2ca50]/20 dark:text-[#f2ca50]/50 font-semibold text-sm cursor-not-allowed">
            Withdraw Funds
          </button>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Upcoming Payouts</p>
          <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white mt-2">₹0.00</p>
          <p className="text-xs text-secondary-400 dark:text-[#d0c5af]/70 mt-1">Clearing soon</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Total Lifetime Earnings</p>
          <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white mt-2">₹0.00</p>
        </div>
      </div>

      <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-[#eae1d4] mt-8 mb-4">Transaction History</h2>
      <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
        <EmptyState
          title="No transactions yet"
          description="Your completed payouts and deductions will appear here."
        />
      </div>
    </div>
  );
}
