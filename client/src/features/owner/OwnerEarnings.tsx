import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function OwnerEarnings() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Earnings</h1>
          <p className="text-secondary-500 mt-1">Overview of your revenue and payouts.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/owner/reports')}>Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary-50 border-primary-200">
          <p className="text-sm font-medium text-primary-700">Available for Payout</p>
          <p className="text-3xl font-bold text-primary-900 mt-2">₹0.00</p>
          <Button variant="primary" className="mt-4 w-full" disabled>Withdraw Funds</Button>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-secondary-500">Upcoming Payouts</p>
          <p className="text-3xl font-bold text-secondary-900 mt-2">₹0.00</p>
          <p className="text-xs text-secondary-400 mt-1">Clearing soon</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-secondary-500">Total Lifetime Earnings</p>
          <p className="text-3xl font-bold text-secondary-900 mt-2">₹0.00</p>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-secondary-900 mt-8 mb-4">Transaction History</h2>
      <div className="bg-white rounded-2xl border border-secondary-200 p-8">
        <EmptyState
          title="No transactions yet"
          description="Your completed payouts and deductions will appear here."
        />
      </div>
    </div>
  );
}
