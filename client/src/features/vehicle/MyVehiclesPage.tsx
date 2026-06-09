import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MyVehiclesPage() {
  const navigate = useNavigate();
  return (
    <PageLayout mainClassName="auth-theme luminous-stack relative flex flex-col bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-7s' }}></div>

      <div className="max-w-5xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight">
            My Vehicles
          </h1>
          <button 
            onClick={() => navigate('/vehicles/new')}
            className="gold-glow-button px-6 py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-sm transition-all shadow-md"
          >
            Add Vehicle
          </button>
        </div>
        
        {/* Dashboard Grid Container */}
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <EmptyState
            title="No vehicles added"
            description="Add a vehicle to make booking faster and easier."
            action={
              <Button variant="primary" onClick={() => navigate('/vehicles/new')}>
                Add Vehicle
              </Button>
            }
          />
        </div>
      </div>
    </PageLayout>
  );
}
