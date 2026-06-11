// ============================================================
// Dashboard Page (Booking Mode)
// ============================================================
// Features a premium dark gold UI matching the authentication
// screens as requested by the user.
// ============================================================

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { VerificationBadge } from '@/features/user/VerificationBadge';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDashboardMetrics } from './dashboard.service';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    getUserDashboardMetrics().then(setMetrics).catch(console.error);

    const handleMouseMove = (e: MouseEvent) => {
      const glows = document.querySelectorAll('.floating-glow') as NodeListOf<HTMLElement>;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      glows.forEach((glow, index) => {
        const speed = (index + 1) * 0.1;
        glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!user) return null;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 17 ? 'Good afternoon' :
    'Good evening';

  return (
    <div className="auth-theme luminous-stack flex min-h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] relative transition-colors duration-300">
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-400 dark:bg-[#f2ca50] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-600 dark:bg-[#d4af37] opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full floating-glow pointer-events-none" style={{ animationDelay: '-7s' }}></div>

      <main className="container-app py-12 relative z-10 w-full max-w-5xl mx-auto px-6">
        {/* Welcome Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight">
                  {greeting}, {user.firstName}!
                </h1>
                <VerificationBadge status={user.verificationStatus} />
              </div>
              <p className="font-sans text-secondary-600 dark:text-[#d0c5af] text-lg max-w-xl">
                Ready to find premium parking? Let's get you sorted.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/')}
              className="gold-glow-button px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-base group shadow-md dark:shadow-[0_0_15px_rgba(242,202,80,0.5)] transition-all duration-300 shrink-0"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
              Find Parking Now
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Dashboard Analytics */}
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 rounded-2xl backdrop-blur-2xl md:col-span-3">
            <h2 className="font-display text-xl font-semibold text-secondary-900 dark:text-[#eae1d4] mb-6">Dashboard Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary-50 dark:bg-[#1a160d]/50 border border-secondary-100 dark:border-[#4d4635]/50 rounded-xl p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-[#f2ca50]/10 flex items-center justify-center text-primary-600 dark:text-[#f2ca50]">
                    <span className="material-symbols-outlined">directions_car</span>
                  </div>
                  <span className="font-sans text-sm font-medium text-secondary-600 dark:text-[#d0c5af]">Total Bookings</span>
                </div>
                <p className="font-display text-3xl font-bold text-secondary-900 dark:text-white">{metrics?.totalBookings || 0}</p>
              </div>
              <div className="bg-secondary-50 dark:bg-[#1a160d]/50 border border-secondary-100 dark:border-[#4d4635]/50 rounded-xl p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-[#f2ca50]/10 flex items-center justify-center text-primary-600 dark:text-[#f2ca50]">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <span className="font-sans text-sm font-medium text-secondary-600 dark:text-[#d0c5af]">Total Spent</span>
                </div>
                <p className="font-display text-3xl font-bold text-secondary-900 dark:text-white">₹{metrics?.totalSpent || 0}</p>
              </div>
              <div className="bg-secondary-50 dark:bg-[#1a160d]/50 border border-secondary-100 dark:border-[#4d4635]/50 rounded-xl p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-[#f2ca50]/10 flex items-center justify-center text-primary-600 dark:text-[#f2ca50]">
                    <span className="material-symbols-outlined">credit_card</span>
                  </div>
                  <span className="font-sans text-sm font-medium text-secondary-600 dark:text-[#d0c5af]">Recent Payments</span>
                </div>
                <p className="font-display text-3xl font-bold text-secondary-900 dark:text-white">0</p>
              </div>
              <div className="bg-secondary-50 dark:bg-[#1a160d]/50 border border-secondary-100 dark:border-[#4d4635]/50 rounded-xl p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-[#f2ca50]/10 flex items-center justify-center text-primary-600 dark:text-[#f2ca50]">
                    <span className="material-symbols-outlined">currency_exchange</span>
                  </div>
                  <span className="font-sans text-sm font-medium text-secondary-600 dark:text-[#d0c5af]">Pending Refunds</span>
                </div>
                <p className="font-display text-3xl font-bold text-secondary-900 dark:text-white">₹0.00</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-6">
               <Link to="/vehicles" className="text-sm font-semibold text-secondary-500 dark:text-[#b4a996] hover:text-secondary-700 dark:hover:text-[#eae1d4] transition-colors flex items-center gap-1">
                 <span className="material-symbols-outlined text-[16px]">no_crash</span> Manage Vehicles
               </Link>
               <Link to="/bookings" className="text-sm font-semibold text-primary-600 dark:text-[#f2ca50] hover:text-primary-700 dark:hover:text-[#d4af37] transition-colors flex items-center gap-1 group">
                 View all bookings <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </Link>
            </div>
          </div>
          {/* Payment & Review Analytics */}
          <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 rounded-2xl backdrop-blur-2xl flex flex-col md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary-900 dark:text-[#eae1d4] mb-4">Payment History</h2>
                <div className="bg-secondary-50 dark:bg-[#1a160d]/50 border border-secondary-100 dark:border-[#4d4635]/50 rounded-xl p-6 text-center text-secondary-500 dark:text-[#d0c5af]">
                  <span className="material-symbols-outlined text-4xl mb-2 text-secondary-300 dark:text-[#4d4635]">receipt_long</span>
                  <p className="text-sm">No recent payments. Your transaction history will appear here.</p>
                </div>
              </div>
              
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary-900 dark:text-[#eae1d4] mb-4">Recent Reviews</h2>
                <div className="bg-secondary-50 dark:bg-[#1a160d]/50 border border-secondary-100 dark:border-[#4d4635]/50 rounded-xl p-6 text-center text-secondary-500 dark:text-[#d0c5af]">
                  <span className="material-symbols-outlined text-4xl mb-2 text-secondary-300 dark:text-[#4d4635]">star_half</span>
                  <p className="text-sm">No recent reviews. Complete a booking to leave a review.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Teaser */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-[#2d240d] dark:to-[#1a160d] border border-primary-200 dark:border-[#4d4635] rounded-2xl p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate('/owner')}>
          <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-primary-200 dark:bg-[#d4af37] opacity-20 dark:opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-[#f2ca50]/10 border border-primary-200 dark:border-[#f2ca50]/20 text-primary-700 dark:text-[#f2ca50] text-xs font-semibold uppercase tracking-widest mb-3">
                <span className="material-symbols-outlined text-[14px] mr-1">paid</span>
                Owner Mode
              </span>
              <h2 className="font-display text-2xl font-bold text-secondary-900 dark:text-white mb-2">Have an empty parking spot?</h2>
              <p className="font-sans text-secondary-600 dark:text-[#d0c5af] text-sm max-w-md">
                Switch to Owner Mode using the header toggle to list your space and start earning with smart parking.
              </p>
            </div>
            
            <Link 
              to="/owner"
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#110e07] border border-primary-200 dark:border-[#4d4635] text-primary-600 dark:text-[#f2ca50] font-semibold text-sm hover:border-primary-400 dark:hover:border-[#d4af37] transition-colors shadow-sm whitespace-nowrap"
            >
              List Your Space
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
