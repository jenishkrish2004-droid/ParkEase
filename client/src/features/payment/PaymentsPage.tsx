import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';

export default function PaymentsPage() {
  return (
    <PageLayout mainClassName="auth-theme luminous-stack relative flex flex-col bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-7s' }}></div>

      <div className="max-w-5xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight mb-8">
          Payments
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
            <h3 className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Total Spent</h3>
            <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">₹0.00</p>
          </div>
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
            <h3 className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Recent Payments</h3>
            <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">0</p>
          </div>
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
            <h3 className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Pending Refunds</h3>
            <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">₹0.00</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-[#eae1d4] mb-6">Payment History</h2>
          <EmptyState
            title="No payments yet"
            description="You haven't made any payments for parking bookings."
          />
        </div>
      </div>
    </PageLayout>
  );
}
