
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function OwnerListings() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight">My Listings</h1>
          <p className="text-secondary-500 dark:text-[#d0c5af] mt-2">Manage your parking spots, pricing, and availability.</p>
        </div>
        <button onClick={() => navigate('/owner/listings/new')} className="gold-glow-button px-6 py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-sm transition-all shadow-md">
          Add New Spot
        </button>
      </div>

      <div className="bg-white/80 dark:bg-transparent surface-glass border border-secondary-200 dark:border-[#4d4635] shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-2xl">
        <div className="flex space-x-2 border-b border-secondary-200 dark:border-[#4d4635] mb-8 overflow-x-auto pb-2">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-600 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50] transition-colors">All (0)</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Active (0)</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Pending Review (0)</button>
        </div>

        <EmptyState
          title="No listings yet"
          description="Create your first parking spot listing to start earning."
          action={
            <button onClick={() => navigate('/owner/listings/new')} className="gold-glow-button px-6 py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-sm transition-all shadow-md">
              Add Parking Spot
            </button>
          }
        />
        
        {/* Future Data Structure Placeholder Hint */}
        <div className="mt-12 border-t border-secondary-100 dark:border-[#4d4635]/50 pt-8 opacity-50 pointer-events-none">
          <h3 className="text-sm font-semibold text-secondary-500 dark:text-[#d0c5af] uppercase tracking-wider mb-4">Future Capabilities Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-secondary-600 dark:text-[#d0c5af]">
            <div>
              <strong className="dark:text-[#eae1d4]">Supported Vehicles:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>Car</li>
                <li>Bike</li>
                <li>EV</li>
              </ul>
            </div>
            <div>
              <strong className="dark:text-[#eae1d4]">Amenities:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>CCTV, Gated</li>
                <li>EV Charging</li>
                <li>Washroom</li>
              </ul>
            </div>
            <div>
              <strong className="dark:text-[#eae1d4]">Availability:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>24x7</li>
                <li>Custom Schedule</li>
              </ul>
            </div>
            <div>
              <strong className="dark:text-[#eae1d4]">Pricing Models:</strong>
              <ul className="list-disc pl-4 mt-1">
                <li>Hourly</li>
                <li>Daily, Monthly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
