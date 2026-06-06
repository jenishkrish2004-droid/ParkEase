import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function OwnerListings() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Listings</h1>
          <p className="text-secondary-500 mt-1">Manage your parking spots, pricing, and availability.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/owner/listings/new')}>Add New Spot</Button>
      </div>

      <div className="flex space-x-4 border-b border-secondary-200 overflow-x-auto">
        <button className="px-4 py-2 text-sm font-semibold text-primary-600 border-b-2 border-primary-600">All (0)</button>
        <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Active (0)</button>
        <button className="px-4 py-2 text-sm font-medium text-secondary-500 hover:text-secondary-700">Pending Review (0)</button>
      </div>

      <Card className="p-8">
        <EmptyState
          title="No listings yet"
          description="Create your first parking spot listing to start earning."
          actionLabel="Add Parking Spot"
          onAction={() => navigate('/owner/listings/new')}
        />
        
        {/* Future Data Structure Placeholder Hint */}
        <div className="mt-12 border-t border-secondary-100 pt-8 opacity-50 pointer-events-none">
          <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-4">Future Capabilities Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-secondary-600">
            <div>
              <strong>Supported Vehicles:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>Car</li>
                <li>Bike</li>
                <li>EV</li>
              </ul>
            </div>
            <div>
              <strong>Amenities:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>CCTV, Gated</li>
                <li>EV Charging</li>
                <li>Washroom</li>
              </ul>
            </div>
            <div>
              <strong>Availability:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>24x7</li>
                <li>Custom Schedule</li>
              </ul>
            </div>
            <div>
              <strong>Pricing Models:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>Hourly</li>
                <li>Daily, Monthly</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
