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

interface ParkingFiltersProps {
  activeAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
  onClearAll: () => void;
}

export function ParkingFilters({ activeAmenities, onToggleAmenity, onClearAll }: ParkingFiltersProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-secondary-900 dark:text-[#eae1d4] flex-1">Amenities</h3>
        {activeAmenities.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-danger-600 dark:text-[#ffb4ab] hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-1.5">
        {AMENITIES_LIST.map((amenity) => {
          const isActive = activeAmenities.includes(amenity);
          return (
            <button
              key={amenity}
              onClick={() => onToggleAmenity(amenity)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all duration-300 text-left",
                isActive
                  ? "bg-primary-50 dark:bg-[#f2ca50]/10 border-primary-500 dark:border-[#f2ca50] text-primary-700 dark:text-[#f2ca50] shadow-[0_0_10px_rgba(242,202,80,0.15)]"
                  : "bg-secondary-50/50 dark:bg-[#1a1712] border-secondary-200 dark:border-[#4d4635]/60 text-secondary-700 dark:text-[#d0c5af] hover:border-primary-300 dark:hover:border-[#f2ca50]/50"
              )}
            >
              <span className={cn(
                "w-4 h-4 rounded flex items-center justify-center border text-[10px] transition-colors shrink-0",
                isActive
                  ? "bg-primary-600 dark:bg-[#f2ca50] border-primary-600 dark:border-[#f2ca50] text-white dark:text-[#3c2f00]"
                  : "border-secondary-300 dark:border-[#4d4635] bg-white dark:bg-[#110e07]"
              )}>
                {isActive && '✓'}
              </span>
              {AMENITIES_DISPLAY_MAP[amenity] || amenity}
            </button>
          );
        })}
      </div>
    </div>
  );
}
