import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';

export default function PaymentsPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-secondary-900 mb-6">Payments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-secondary-500">Total Spent</h3>
            <p className="text-3xl font-bold text-secondary-900 mt-2">₹0.00</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-secondary-500">Recent Payments</h3>
            <p className="text-3xl font-bold text-secondary-900 mt-2">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-secondary-500">Pending Refunds</h3>
            <p className="text-3xl font-bold text-secondary-900 mt-2">₹0.00</p>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-secondary-900 mb-4">Payment History</h2>
        <EmptyState
          title="No payments yet"
          description="You haven't made any payments for parking bookings."
        />
      </div>
    </PageLayout>
  );
}
