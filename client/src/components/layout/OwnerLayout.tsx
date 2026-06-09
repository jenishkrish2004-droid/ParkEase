import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function OwnerLayout() {
  return (
    <div className="auth-theme luminous-stack relative flex flex-col min-h-screen bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full pointer-events-none floating-glow" style={{ animationDelay: '-7s' }}></div>

      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
