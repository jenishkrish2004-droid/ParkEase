
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getOwnerSpots } from './parking.service';
import type { IParkingSpotDetail } from '@parkora/shared';

export default function OwnerListings() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState<IParkingSpotDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerSpots()
      .then(setSpots)
      .finally(() => setLoading(false));
  }, []);

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
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-600 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50] transition-colors">All ({spots.length})</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Active ({spots.filter(s => s.status === 'ACTIVE').length})</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-500 dark:text-[#d0c5af] hover:text-secondary-900 dark:hover:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#1a1712]/50 transition-colors">Pending Review ({spots.filter(s => s.status === 'PENDING_REVIEW').length})</button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-secondary-500">Loading your listings...</div>
        ) : spots.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first parking spot listing to start earning."
            action={
              <button onClick={() => navigate('/owner/listings/new')} className="gold-glow-button px-6 py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-[#3c2f00] font-semibold text-sm transition-all shadow-md">
                Add Parking Spot
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {spots.map(spot => (
              <div 
                key={spot.id} 
                className="group flex flex-col sm:flex-row sm:h-[170px] p-2 sm:p-2.5 backdrop-blur-2xl border rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgba(242,202,80,0.1)] transition-all duration-300 cursor-pointer overflow-hidden bg-white/80 dark:bg-[#1a1712]/80 border-white dark:border-[#4d4635]/50 scale-100 hover:scale-[1.01] hover:border-primary-200 dark:hover:border-[#f2ca50]/50"
              >
                {/* Left Content */}
                <div className="flex flex-1 flex-col sm:flex-row items-start p-3 gap-3 sm:gap-4 min-w-0">
                  {/* Image Box */}
                  <div className="w-full sm:w-28 h-48 sm:h-28 rounded-2xl sm:rounded-[1.25rem] bg-secondary-100 dark:bg-[#2a2416] border border-secondary-200/50 dark:border-[#f2ca50]/10 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative">
                    {spot.images?.[0] ? (
                      <img src={spot.images[0].url} alt={spot.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <span className="text-3xl sm:text-4xl drop-shadow-sm">🅿️</span>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-white/90 dark:bg-[#110e07]/90 text-secondary-900 dark:text-[#eae1d4] backdrop-blur-sm shadow-sm">{spot.status}</span>
                  </div>
                  
                  <div className="flex-1 w-full mt-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-[#eae1d4] group-hover:text-primary-600 dark:group-hover:text-[#f2ca50] transition-colors truncate min-w-0 shrink" title={spot.title}>
                        {spot.title}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600 dark:text-[#d0c5af] mb-2 sm:mb-3">
                      <span className="flex items-center gap-1 font-medium truncate">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> {spot.city}
                      </span>
                      <div className="hidden sm:block w-1 h-1 rounded-full bg-secondary-300 dark:bg-[#4d4635]"></div>
                      <span className="flex items-center gap-1 font-semibold text-primary-600 dark:text-[#f2ca50] bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-[16px]">local_parking</span> {spot.totalSlots} total slots
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Card */}
                <div className="sm:w-[150px] h-full shrink-0 bg-white dark:bg-[#110e07] rounded-[1.5rem] shadow-sm border border-secondary-100 dark:border-[#4d4635] p-3 flex flex-row sm:flex-col items-center sm:items-end justify-between mt-2 sm:mt-0 relative overflow-hidden group-hover:border-primary-200 dark:group-hover:border-[#f2ca50]/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 to-transparent dark:from-[#f2ca50]/5 dark:to-transparent pointer-events-none"></div>
                  
                  <div className="text-left sm:text-right relative z-10 w-full min-w-0">
                    <div className="text-[10px] text-secondary-500 dark:text-[#d0c5af]/80 font-bold uppercase tracking-widest mb-1.5 sm:mb-2 truncate">Base Price</div>
                    <div className="flex items-baseline gap-1 sm:justify-end">
                      <span className="text-sm font-bold text-secondary-400 dark:text-[#d0c5af]/50">₹</span>
                      <span className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-[#eae1d4] tracking-tight">{spot.pricePerHour}</span>
                    </div>
                    <div className="text-[11px] text-secondary-500 dark:text-[#d0c5af] mt-1 font-semibold">per hour</div>
                  </div>
                  
                  <button className="gold-glow-button relative z-10 w-auto sm:w-full px-6 sm:px-0 py-2 sm:py-2.5 rounded-xl text-white bg-secondary-800 hover:bg-secondary-900 dark:bg-secondary-700 dark:hover:bg-secondary-600 font-bold text-sm transition-all shadow-md mt-0 sm:mt-2">
                    Edit Spot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
