import { useNavigate } from 'react-router-dom';
import { type ParkingSpotData } from '../search.service';
import { AMENITIES_DISPLAY_MAP } from './ParkingFilters';
import { useAuth } from '@/app/providers/AuthProvider';

interface ParkingSpotCardProps {
  spot: ParkingSpotData;
  durationHours: number;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

export function ParkingSpotCard({ spot, durationHours, isActive, onHover, onClick }: ParkingSpotCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div 
      id={`spot-card-${spot.id}`}
      onMouseEnter={() => onHover(spot.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(spot.id)}
      className={`group flex flex-col sm:flex-row sm:h-[170px] xl:h-[180px] p-2 sm:p-2.5 backdrop-blur-2xl border rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgba(242,202,80,0.1)] transition-all duration-300 cursor-pointer overflow-hidden
        ${isActive 
          ? 'bg-white dark:bg-[#252119] border-primary-200 dark:border-[#f2ca50]/50 scale-[1.01]' 
          : 'bg-white/80 dark:bg-[#1a1712]/80 border-white dark:border-[#4d4635]/50 scale-100'}`}
    >
      
      {/* Left Content */}
      <div className="flex flex-1 flex-col sm:flex-row items-start p-3 gap-3 sm:gap-4 min-w-0">
        {/* Premium Image Box */}
        <div className="w-full sm:w-28 h-48 sm:h-28 xl:w-32 xl:h-32 rounded-2xl sm:rounded-[1.25rem] bg-secondary-100 dark:bg-[#2a2416] border border-secondary-200/50 dark:border-[#f2ca50]/10 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative">
          {spot.images && spot.images.length > 0 ? (
            <img 
              src={spot.images[0]} 
              alt={spot.name} 
              className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} 
              loading="lazy" 
            />
          ) : (
            <span className="text-3xl sm:text-4xl drop-shadow-sm">🅿️</span>
          )}
          {isActive && (
            <div className="absolute inset-0 bg-primary-500/10 dark:bg-[#f2ca50]/10 pointer-events-none"></div>
          )}
        </div>
        
        <div className="flex-1 w-full mt-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-[#eae1d4] group-hover:text-primary-600 dark:group-hover:text-[#f2ca50] transition-colors truncate min-w-0 shrink" title={spot.name}>{spot.name}</h3>
            <div className="flex items-center gap-1 shrink-0 bg-white dark:bg-[#110e07] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold text-secondary-700 dark:text-[#eae1d4] border border-secondary-200/60 dark:border-[#4d4635] shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-warning-500">star</span>
              {spot.rating} <span className="text-secondary-400 font-medium">({spot.reviews})</span>
            </div>
            {spot.rating >= 4.8 && (
              <span className="shrink-0 px-2 py-1 bg-gradient-to-r from-warning-400 to-warning-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">Top Rated</span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600 dark:text-[#d0c5af] mb-2 sm:mb-3">
            <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-[16px]">distance</span> {spot.distanceKm} km away</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-secondary-300 dark:bg-[#4d4635]"></div>
            <span className="flex items-center gap-1 font-semibold text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 px-2 py-0.5 rounded-md">
              <span className="material-symbols-outlined text-[16px]">local_parking</span> {spot.availableSpots} spots left
            </span>
          </div>
          
          {/* Amenities */}
          <div className="flex flex-wrap gap-2 h-[28px] overflow-hidden">
            {spot.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 bg-white/80 dark:bg-[#110e07]/80 text-secondary-600 dark:text-[#d0c5af] rounded-lg border border-secondary-200/50 dark:border-[#4d4635]/50 shadow-sm whitespace-nowrap">
                {AMENITIES_DISPLAY_MAP[amenity] || amenity}
              </span>
            ))}
            {spot.amenities.length > 3 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 bg-secondary-100/50 dark:bg-[#252119]/50 text-secondary-500 dark:text-[#d0c5af]/50 rounded-lg">
                +{spot.amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Action Card */}
      <div className="sm:w-[150px] xl:w-[170px] h-full shrink-0 bg-white dark:bg-[#110e07] rounded-[1.5rem] shadow-sm border border-secondary-100 dark:border-[#4d4635] p-3 flex flex-row sm:flex-col items-center sm:items-end justify-between mt-2 sm:mt-0 relative overflow-hidden group-hover:border-primary-200 dark:group-hover:border-[#f2ca50]/30 transition-colors">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 to-transparent dark:from-[#f2ca50]/5 dark:to-transparent pointer-events-none"></div>
        
        <div className="text-left sm:text-right relative z-10 w-full">
          <div className="text-[10px] text-secondary-500 dark:text-[#d0c5af]/80 font-bold uppercase tracking-widest mb-1.5 sm:mb-2">Total • {durationHours} hrs</div>
          <div className="flex items-baseline gap-1 sm:justify-end">
            <span className="text-sm font-bold text-secondary-400 dark:text-[#d0c5af]/50">₹</span>
            <span className="text-2xl sm:text-4xl font-black text-secondary-900 dark:text-[#eae1d4] tracking-tight">{spot.pricePerHour * durationHours}</span>
          </div>
          <div className="text-[11px] text-secondary-500 dark:text-[#d0c5af] mt-1 font-semibold">₹{spot.pricePerHour}/hr</div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            const dest = `/parking/${spot.id}`;
            if (!isAuthenticated) {
              navigate('/login', { state: { from: dest } });
            } else {
              navigate(dest);
            }
          }}
          className="gold-glow-button relative z-10 w-auto sm:w-full px-6 sm:px-0 py-2 sm:py-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 dark:bg-[#f2ca50] dark:hover:bg-[#fceb96] dark:text-[#3c2f00] font-bold text-sm transition-all shadow-md mt-0 sm:mt-2"
        >
          Book Space
        </button>
      </div>
    </div>
  );
}
