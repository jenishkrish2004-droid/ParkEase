import { useState } from 'react';
import { cn } from '@/lib/utils';

export const AMENITIES_LIST = [
  'Covered Parking',
  '24/7 Access',
  'CCTV',
  'Security Guard',
  'Valet Parking',
  'EV Charging Available',
  'Wheelchair Accessible',
  'Multi-Level Parking',
];

export const AMENITIES_DISPLAY_MAP: Record<string, string> = {
  'Covered Parking': 'Covered',
  '24/7 Access': '24/7',
  'CCTV': 'CCTV',
  'Security Guard': 'Security Guard',
  'Valet Parking': 'Valet',
  'EV Charging Available': 'EV Charging',
  'Wheelchair Accessible': 'Wheelchair Acc.',
  'Multi-Level Parking': 'Multi-Level',
};

const QUICK_AMENITIES = [
  'Covered Parking',
  '24/7 Access',
  'CCTV',
  'Valet Parking',
];

interface ParkingFiltersProps {
  activeAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
  onClearAll: () => void;
}

export function ParkingFilters({ activeAmenities, onToggleAmenity, onClearAll }: ParkingFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Render only the 4 quick filters */}
        {QUICK_AMENITIES.map((amenity) => {
          const isActive = activeAmenities.includes(amenity);
          return (
            <button
              key={amenity}
              onClick={() => onToggleAmenity(amenity)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border backdrop-blur-md",
                isActive
                  ? "bg-primary-50 dark:bg-[#f2ca50]/10 border-primary-500 dark:border-[#f2ca50]/50 text-primary-700 dark:text-[#f2ca50] shadow-[0_0_10px_rgba(242,202,80,0.2)]"
                  : "bg-white/60 dark:bg-[#110e07]/60 border-secondary-200 dark:border-[#4d4635]/60 text-secondary-600 dark:text-[#d0c5af] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 hover:text-primary-600 dark:hover:text-[#fceb96]"
              )}
            >
              {AMENITIES_DISPLAY_MAP[amenity] || amenity}
            </button>
          );
        })}

        {/* "+ More" Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border backdrop-blur-md bg-white/60 dark:bg-[#110e07]/60 border-secondary-200 dark:border-[#4d4635]/60 text-primary-600 dark:text-[#f2ca50] hover:border-primary-300 dark:hover:border-[#f2ca50] flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">tune</span>
          +4 More
        </button>

        {activeAmenities.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-danger-600 dark:text-[#ffb4ab] hover:underline ml-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Premium Glassmorphic Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-secondary-200 dark:border-[#4d4635] bg-white dark:bg-[#110e07] shadow-2xl dark:shadow-[0_0_30px_rgba(242,202,80,0.15)] transition-all duration-300 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-150 dark:border-[#4d4635]">
              <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">Filter Amenities</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-secondary-400 hover:text-secondary-600 dark:text-[#d0c5af] dark:hover:text-[#eae1d4] hover:bg-secondary-100 dark:hover:bg-[#252119] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES_LIST.map((amenity) => {
                  const isActive = activeAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => onToggleAmenity(amenity)}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 text-left",
                        isActive
                          ? "bg-primary-50 dark:bg-[#f2ca50]/10 border-primary-500 dark:border-[#f2ca50] text-primary-700 dark:text-[#f2ca50] shadow-[0_0_10px_rgba(242,202,80,0.15)]"
                          : "bg-secondary-50/50 dark:bg-[#1a1712] border-secondary-200 dark:border-[#4d4635]/60 text-secondary-700 dark:text-[#d0c5af] hover:border-primary-350 dark:hover:border-[#f2ca50]/50"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded flex items-center justify-center border text-[12px] transition-colors shrink-0",
                        isActive
                          ? "bg-primary-600 dark:bg-[#f2ca50] border-primary-600 dark:border-[#f2ca50] text-white dark:text-[#3c2f00]"
                          : "border-secondary-300 dark:border-[#4d4635]"
                      )}>
                        {isActive && '✓'}
                      </span>
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-secondary-50/50 dark:bg-[#1a1712] border-t border-secondary-150 dark:border-[#4d4635] gap-4">
              <button
                onClick={() => {
                  onClearAll();
                }}
                disabled={activeAmenities.length === 0}
                className="px-4 py-2 text-sm font-bold text-secondary-500 dark:text-[#d0c5af] hover:text-danger-600 dark:hover:text-[#ffb4ab] disabled:opacity-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="gold-glow-button px-6 py-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-[#f2ca50] dark:hover:bg-[#fceb96] dark:text-[#3c2f00] font-bold text-sm transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
