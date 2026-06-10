import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  return (
    <PageLayout mainClassName="auth-theme luminous-stack relative flex flex-col bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-7s' }}></div>

      <div className="max-w-5xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight mb-8">
          My Bookings
        </h1>
        
        {/* Dashboard Grid Container */}
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          {/* Tabs */}
          <div className="flex space-x-2 border-b border-secondary-200 dark:border-[#4d4635] mb-8 overflow-x-auto pb-2">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-600 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50] transition-colors">Upcoming</button>
            <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Completed</button>
            <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Cancelled</button>
            <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Reviews</button>
          </div>

          <EmptyState
            title="No bookings yet"
            description="When you book a parking spot, it will appear here."
            action={
              <Button variant="primary" onClick={() => navigate('/search')}>
                Find Parking
              </Button>
            }
          />
        </div>
      </div>
    </PageLayout>
  );
}
