import { PageLayout } from '@/components/layout/PageLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MyVehiclesPage() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">My Vehicles</h1>
          <Button variant="primary" onClick={() => navigate('/vehicles/new')}>Add Vehicle</Button>
        </div>
        
        <EmptyState
          title="No vehicles added"
          description="Add your car, bike, or EV to quickly select them during checkout."
          actionLabel="Add Vehicle"
          onAction={() => navigate('/vehicles/new')}
        />
      </div>
    </PageLayout>
  );
}
