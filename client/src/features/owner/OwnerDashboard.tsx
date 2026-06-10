import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/features/user/VerificationBadge';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getOwnerMetrics } from './owner.service';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    getOwnerMetrics().then(setMetrics).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight">Owner Dashboard</h1>
          <p className="text-secondary-500 dark:text-[#d0c5af] mt-2">Manage your parking spots and track your earnings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/verification')}>Complete Verification</Button>
          <button onClick={() => navigate('/owner/listings/new')} className="gold-glow-button px-6 py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-sm transition-all shadow-md">
            Add Parking Spot
          </button>
        </div>
      </div>

      {/* Verification Warning */}
      {user?.verificationStatus !== 'APPROVED' && (
        <div className="p-4 rounded-2xl border border-warning-200 dark:border-warning-900/50 bg-warning-50/80 dark:bg-warning-900/20 surface-glass backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VerificationBadge status={user?.verificationStatus || 'PENDING'} />
            <p className="text-sm font-medium text-warning-800 dark:text-warning-400">
              Complete your identity verification (Email & Phone) to unlock owner features.
            </p>
          </div>
          <Button variant="outline" className="bg-white dark:bg-transparent hover:bg-warning-50 dark:hover:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-300 dark:border-warning-700/50" onClick={() => navigate('/verification')}>
            Verify Identity
          </Button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] transition-all duration-300">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Active Listings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">{metrics?.activeListings || 0}</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] transition-all duration-300">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Total Bookings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">{metrics?.totalBookings || 0}</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] transition-all duration-300">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Monthly Earnings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">₹{metrics?.monthlyEarnings || 0}</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] transition-all duration-300">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Average Rating</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">{metrics?.averageRating || '0.0'} ★</p>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary-50/80 dark:bg-[#f2ca50]/10 surface-glass border border-primary-200 dark:border-[#f2ca50]/20 shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] transition-all duration-300">
          <p className="text-sm font-medium text-primary-700 dark:text-[#f2ca50]">Available for Payout</p>
          <p className="text-3xl font-display font-bold text-primary-900 dark:text-[#fceb96] mt-2">₹{metrics?.earningsBreakdown?.availableForPayout || '0.00'}</p>
          <button disabled className="mt-4 w-full px-6 py-2.5 rounded-xl text-white bg-primary-600/50 dark:bg-[#f2ca50]/20 dark:text-[#f2ca50]/50 font-semibold text-sm cursor-not-allowed transition-all">
            Withdraw Funds
          </button>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl flex flex-col justify-center hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(242,202,80,0.15)] transition-all duration-300">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Upcoming Payouts</p>
          <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white mt-2">₹{metrics?.earningsBreakdown?.upcomingPayouts || '0.00'}</p>
          <p className="text-xs text-secondary-400 dark:text-[#d0c5af]/70 mt-1">Clearing soon</p>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl hover:shadow-[0_8px_30px_rgba(242,202,80,0.1)] transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold text-secondary-900 dark:text-[#eae1d4]">Bookings Management</h2>
          <Button variant="outline" className="text-sm py-1.5 px-4 h-auto" onClick={() => navigate('/owner/listings')}>Manage Listings</Button>
        </div>
        
        <div className="flex space-x-2 border-b border-secondary-200 dark:border-[#4d4635] mb-8 overflow-x-auto pb-2">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-600 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50] transition-colors">Upcoming</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Active</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Completed</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Cancelled</button>
        </div>

        <div className="py-8 text-center border border-dashed border-secondary-200 dark:border-[#4d4635] rounded-xl bg-secondary-50/50 dark:bg-[#1a1712]/30">
          <p className="text-secondary-500 dark:text-[#d0c5af]">No bookings found.</p>
        </div>
      </div>
    </div>
  );
}
