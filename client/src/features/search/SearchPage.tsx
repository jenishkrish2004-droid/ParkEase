import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';
import { fetchSearchResults, type ParkingSpotData } from './search.service';

import { AvailabilitySelector } from './components/AvailabilitySelector';
import { VehicleTypeSelector, type VehicleType } from './components/VehicleTypeSelector';
import { ParkingFilters, AMENITIES_DISPLAY_MAP } from './components/ParkingFilters';
import { SortSelector, type SortOption } from './components/SortSelector';
import { ParkingSpotCard } from './components/ParkingSpotCard';
import { ParkingMap } from './components/ParkingMap';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const dateParam = searchParams.get('date');

  const [isLoading, setIsLoading] = useState(true);
  const [parkingResults, setParkingResults] = useState<ParkingSpotData[]>([]);

  // Filter States
  const [selectedDate, setSelectedDate] = useState(dateParam || new Date().toISOString());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [durationHours, setDurationHours] = useState(2);
  
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('Recommended');
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);

  // Scroll Header State
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (currentScrollY > lastScrollY.current + 10) {
      setIsHeaderVisible(false); // scrolling down
    } else if (currentScrollY < lastScrollY.current - 10 || currentScrollY <= 10) {
      setIsHeaderVisible(true); // scrolling up
    }
    lastScrollY.current = currentScrollY;
  };

  const handleMarkerClick = (id: string) => {
    setActiveSpotId(id);
    const element = document.getElementById(`spot-card-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    fetchSearchResults(query)
      .then((data) => {
        if (isMounted) {
          setParkingResults(data.parkingSpots);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Search error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  // Derived Filtered & Sorted Results
  const filteredAndSortedResults = useMemo(() => {
    let results = [...parkingResults];

    // Filter by Vehicle Type
    results = results.filter(spot => spot.supportedVehicles.includes(vehicleType));

    // Filter by Amenities (must have all selected amenities)
    if (activeAmenities.length > 0) {
      results = results.filter(spot => 
        activeAmenities.every(amenity => spot.amenities.includes(amenity))
      );
    }

    // Sort Results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'Nearest First':
          return a.distanceKm - b.distanceKm;
        case 'Lowest Price':
          return a.pricePerHour - b.pricePerHour;
        case 'Highest Availability':
          return b.availableSpots - a.availableSpots;
        case 'Best Rated':
          return b.rating - a.rating;
        case 'Recommended':
        default:
          // For recommended, maybe a mix of rating and distance. Here we just fallback to default order or rating
          return b.rating - a.rating;
      }
    });

    return results;
  }, [parkingResults, vehicleType, activeAmenities, sortBy]);

  const handleToggleAmenity = (amenity: string) => {
    setActiveAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const SidebarContent = (
    <div className="space-y-5">
      {/* Availability Section */}
      <div>
        <h3 className="text-sm font-bold text-secondary-900 dark:text-[#eae1d4] mb-3">Booking Availability</h3>
        <AvailabilitySelector 
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          durationHours={durationHours}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          onDurationChange={setDurationHours}
        />
      </div>

      {/* Vehicle Type Section */}
      <div>
        <h3 className="text-sm font-bold text-secondary-900 dark:text-[#eae1d4] mb-3">Vehicle Type</h3>
        <VehicleTypeSelector 
          selectedVehicle={vehicleType}
          onVehicleChange={setVehicleType}
        />
      </div>

      {/* Quick Filters Section */}
      <ParkingFilters 
        activeAmenities={activeAmenities}
        onToggleAmenity={handleToggleAmenity}
        onClearAll={() => setActiveAmenities([])}
      />

      {/* Future Placeholders */}
      <div className="pt-6 border-t border-secondary-200 dark:border-[#4d4635] space-y-6 opacity-50 pointer-events-none">
        <div>
          <h3 className="text-sm font-bold text-secondary-900 dark:text-[#eae1d4] mb-3">Price Range</h3>
          <div className="h-2 bg-secondary-200 dark:bg-[#4d4635] rounded-full w-full"></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-secondary-900 dark:text-[#eae1d4] mb-3">Distance Radius</h3>
          <div className="h-2 bg-secondary-200 dark:bg-[#4d4635] rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout 
      showFooter={false} 
      className="h-screen overflow-hidden"
      mainClassName="flex flex-col flex-1 min-h-0 bg-secondary-50/50 dark:bg-transparent overflow-hidden transition-colors duration-300"
    >
      <div className="container-app pt-0 pb-4 sm:pb-6 max-w-[1536px] mx-auto flex-1 flex flex-col min-h-0">
        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,350px)] xl:grid-cols-[240px_minmax(0,1fr)_minmax(0,450px)] h-full min-h-0">
          
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden lg:block w-full h-full overflow-y-auto custom-scrollbar pr-2 pb-10 pt-4 sm:pt-6">
            {SidebarContent}
          </aside>

          {/* Center Results List */}
          <main 
            className="w-full h-full overflow-y-auto custom-scrollbar pb-24 lg:pb-10 relative border-l border-r border-secondary-200 dark:border-[#4d4635]"
            onScroll={handleScroll}
          >
            {/* Results Header */}
            <div 
              className={cn(
                "sticky top-0 z-30 transition-all duration-300 mb-2",
                isHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0 pointer-events-none"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 lg:px-6 bg-white/95 dark:bg-[#1a1712]/95 backdrop-blur-md border-b border-secondary-200 dark:border-[#4d4635] shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">
                    Showing {isLoading ? '...' : filteredAndSortedResults.length} Parking Spots
                  </h2>
                  
                  {/* Active Filter Tags (Mobile only or extra visibility) */}
                  <div className="text-[11px] text-secondary-500 dark:text-[#d0c5af] mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[#3c2f00] dark:text-[#3c2f00] bg-primary-400 dark:bg-[#f2ca50] shadow-md dark:shadow-[0_0_10px_rgba(242,202,80,0.3)] border border-primary-500/20">
                      {vehicleType}
                    </span>
                    {activeAmenities.map((amenity) => (
                      <span key={amenity} className="px-2 py-0.5 rounded-md font-bold text-[#3c2f00] dark:text-[#3c2f00] bg-primary-400 dark:bg-[#f2ca50] shadow-md dark:shadow-[0_0_10px_rgba(242,202,80,0.3)] border border-primary-500/20">
                        {AMENITIES_DISPLAY_MAP[amenity] || amenity}
                      </span>
                    ))}
                    {(activeAmenities.length > 0) && (
                      <button 
                        onClick={() => setActiveAmenities([])}
                        className="text-danger-600 dark:text-[#ffb4ab] font-bold hover:underline ml-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <SortSelector 
                    selectedSort={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </div>
            </div>

            {/* Results List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50 flex-1">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary-500 dark:text-[#f2ca50] mb-4">progress_activity</span>
                <p className="text-secondary-500 dark:text-[#d0c5af]">Searching for optimal locations...</p>
              </div>
            ) : (
              <div className="animate-slide-up space-y-5 sm:space-y-6 pb-6 px-4 lg:px-6 pt-4 lg:pt-6">
                {filteredAndSortedResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#110e07] border border-secondary-200 dark:border-[#4d4635] rounded-3xl">
                    <span className="material-symbols-outlined text-6xl text-secondary-300 dark:text-[#4d4635] mb-4">local_parking</span>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4] mb-2">No parking spots found</h3>
                    <p className="text-secondary-500 dark:text-[#d0c5af]">Try adjusting your filters or search location.</p>
                    <button 
                      onClick={() => {
                        setActiveAmenities([]);
                        setVehicleType('Car');
                      }}
                      className="mt-6 px-6 py-2 bg-primary-50 dark:bg-[#f2ca50]/10 text-primary-600 dark:text-[#f2ca50] font-semibold rounded-lg hover:bg-primary-100 dark:hover:bg-[#f2ca50]/20 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredAndSortedResults.map((spot) => (
                    <ParkingSpotCard 
                      key={spot.id} 
                      spot={spot} 
                      durationHours={durationHours} 
                      isActive={spot.id === activeSpotId}
                      onHover={setActiveSpotId}
                      onClick={(id) => setActiveSpotId(id)}
                    />
                  ))
                )}
              </div>
            )}
          </main>

          {/* Right Map Panel (Desktop) */}
          <div className="hidden lg:block w-full h-full pl-4 lg:pl-6 pt-4 lg:pt-6">
            <aside className="w-full h-[calc(100%-1.5rem)] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-secondary-200 dark:border-[#4d4635] dark:shadow-none">
              <ParkingMap 
                parkingSpots={filteredAndSortedResults} 
                activeSpotId={activeSpotId} 
                onMarkerHover={setActiveSpotId}
                onMarkerClick={handleMarkerClick}
              />
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile Floating Filters Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="gold-glow-button flex items-center gap-2 px-5 py-3 rounded-full bg-primary-600 dark:bg-[#f2ca50] text-white dark:text-[#3c2f00] font-bold shadow-xl dark:shadow-[0_0_20px_rgba(242,202,80,0.3)] transition-transform hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined">tune</span>
          Filters
          {(activeAmenities.length > 0) && (
            <span className="ml-1 flex items-center justify-center w-5 h-5 bg-white dark:bg-[#3c2f00] text-primary-600 dark:text-[#f2ca50] rounded-full text-xs">
              {activeAmenities.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-sm h-full bg-white dark:bg-[#110e07] shadow-2xl flex flex-col animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-[#4d4635]">
              <h2 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4]">Filters</h2>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-secondary-500 hover:text-secondary-900 dark:text-[#d0c5af] dark:hover:text-[#eae1d4] rounded-full hover:bg-secondary-100 dark:hover:bg-[#252119] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {SidebarContent}
            </div>
            <div className="p-4 border-t border-secondary-200 dark:border-[#4d4635] bg-secondary-50/50 dark:bg-[#1a1712]">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full gold-glow-button px-6 py-3 rounded-xl bg-primary-600 dark:bg-[#f2ca50] text-white dark:text-[#3c2f00] font-bold shadow-lg"
              >
                Show Results ({filteredAndSortedResults.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
