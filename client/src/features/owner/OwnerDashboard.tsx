import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/features/user/VerificationBadge';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Active Listings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">0</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Total Bookings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">0</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Monthly Earnings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">₹0</p>
        </div>
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 rounded-2xl backdrop-blur-2xl">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Average Rating</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">0.0 ★</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Placeholder */}
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <h2 className="text-xl font-display font-semibold text-secondary-900 dark:text-[#eae1d4] mb-6">Recent Bookings</h2>
          <div className="py-8 text-center border border-dashed border-secondary-200 dark:border-[#4d4635] rounded-xl bg-secondary-50/50 dark:bg-[#1a1712]/30">
            <p className="text-secondary-500 dark:text-[#d0c5af]">No recent bookings found.</p>
          </div>
        </div>

        {/* Quick Actions Placeholder */}
        <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
          <h2 className="text-xl font-display font-semibold text-secondary-900 dark:text-[#eae1d4] mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl border border-secondary-200 dark:border-[#4d4635] hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:bg-secondary-50 dark:hover:bg-[#f2ca50]/5 text-secondary-700 dark:text-[#eae1d4] transition-all" onClick={() => navigate('/owner/listings')}>📝 Manage Listings</button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-secondary-200 dark:border-[#4d4635] hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:bg-secondary-50 dark:hover:bg-[#f2ca50]/5 text-secondary-700 dark:text-[#eae1d4] transition-all" onClick={() => navigate('/owner/bookings')}>📅 View Booking Calendar</button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-secondary-200 dark:border-[#4d4635] hover:border-primary-400 dark:hover:border-[#f2ca50]/50 hover:bg-secondary-50 dark:hover:bg-[#f2ca50]/5 text-secondary-700 dark:text-[#eae1d4] transition-all" onClick={() => navigate('/owner/earnings')}>💸 View Earnings Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
