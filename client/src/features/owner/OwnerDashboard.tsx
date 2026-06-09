import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/features/user/VerificationBadge';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-[#eae1d4]">Owner Dashboard</h1>
          <p className="text-secondary-500 dark:text-[#d0c5af] mt-1">Manage your parking spots and track your earnings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/verification')}>Complete Verification</Button>
          <Button variant="primary" onClick={() => navigate('/owner/listings/new')}>Add Parking Spot</Button>
        </div>
      </div>

      {/* Verification Warning */}
      {user?.verificationStatus !== 'APPROVED' && (
        <Card className="p-4 border-warning-200 dark:border-warning-900/50 bg-warning-50 dark:bg-warning-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VerificationBadge status={user?.verificationStatus || 'PENDING'} />
            <p className="text-sm font-medium text-warning-800 dark:text-warning-500">
              Complete your identity verification (Email & Phone) to unlock owner features.
            </p>
          </div>
          <Button variant="outline" className="bg-white hover:bg-warning-50 text-warning-700 border-warning-300" onClick={() => navigate('/verification')}>
            Verify Identity
          </Button>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Active Listings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mt-2">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Total Bookings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mt-2">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Monthly Earnings</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mt-2">₹0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-secondary-500 dark:text-[#d0c5af]">Average Rating</p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-[#eae1d4] mt-2">0.0 ★</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Placeholder */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4] mb-4">Recent Bookings</h2>
          <div className="py-8 text-center border border-dashed border-secondary-200 dark:border-[#4d4635] rounded-xl">
            <p className="text-secondary-500 dark:text-[#d0c5af]">No recent bookings found.</p>
          </div>
        </Card>

        {/* Quick Actions Placeholder */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/owner/listings')}>📝 Manage Listings</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/owner/bookings')}>📅 View Booking Calendar</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/owner/earnings')}>💸 View Earnings Report</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
