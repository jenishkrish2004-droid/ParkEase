import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';
import { fetchSearchResults, type ParkingSpotData } from './search.service';

import { AvailabilitySelector } from './components/AvailabilitySelector';
import { VehicleTypeSelector, type VehicleType } from './components/VehicleTypeSelector';
import { ParkingFilters, AMENITIES_DISPLAY_MAP } from './components/ParkingFilters';
import { SortSelector, type SortOption } from './components/SortSelector';

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

  return (
    <PageLayout mainClassName="bg-white dark:bg-transparent min-h-screen pt-0 transition-colors duration-300">
      {/* Sticky Filter Bar (Full Width) - Only Availability Controls */}
      <div className="sticky top-[4rem] z-40 w-full bg-white/95 dark:bg-[#110e07]/95 backdrop-blur-xl border-b border-secondary-200 dark:border-[#4d4635] shadow-sm py-3 transition-colors duration-300">
        <div className="container-app">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <AvailabilitySelector 
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              durationHours={durationHours}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onDurationChange={setDurationHours}
            />
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="container-app py-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Compact Results Header & Quick Filters */}
          <div className="space-y-4 mb-6 pb-4 border-b border-secondary-100 dark:border-[#4d4635]/35">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4]">
                  Showing {isLoading ? '...' : filteredAndSortedResults.length} Parking Spots
                </h2>
                
                {/* Active Filter Tags */}
                <div className="text-xs text-secondary-500 dark:text-[#d0c5af] mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="uppercase tracking-wider font-semibold text-secondary-400">Filters:</span>
                  <span className="font-bold text-secondary-800 dark:text-[#eae1d4]">{vehicleType}</span>
                  {activeAmenities.map((amenity) => (
                    <span key={amenity} className="flex items-center gap-1.5">
                      <span className="text-secondary-300 dark:text-[#4d4635]">•</span>
                      <span className="font-bold text-secondary-800 dark:text-[#eae1d4]">{AMENITIES_DISPLAY_MAP[amenity] || amenity}</span>
                    </span>
                  ))}
                  {(activeAmenities.length > 0) && (
                    <>
                      <span className="text-secondary-300 dark:text-[#4d4635]">•</span>
                      <button 
                        onClick={() => {
                          setActiveAmenities([]);
                          setVehicleType('Car');
                        }}
                        className="text-danger-600 dark:text-[#ffb4ab] font-bold hover:underline"
                      >
                        [ Clear Filters ]
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Controls: Vehicle Type & Sort Dropdown */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <VehicleTypeSelector 
                  selectedVehicle={vehicleType}
                  onVehicleChange={setVehicleType}
                />
                <div className="hidden sm:block h-6 w-px bg-secondary-200 dark:bg-[#4d4635]/60"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-secondary-500 dark:text-[#d0c5af] uppercase tracking-wider">Sort By:</span>
                  <SortSelector 
                    selectedSort={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </div>
            </div>

            {/* Compressed Quick Filters Component */}
            <div className="pt-1">
              <ParkingFilters 
                activeAmenities={activeAmenities}
                onToggleAmenity={handleToggleAmenity}
                onClearAll={() => setActiveAmenities([])}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary-500 dark:text-[#f2ca50] mb-4">progress_activity</span>
              <p className="text-secondary-500 dark:text-[#d0c5af]">Searching for optimal locations...</p>
            </div>
          ) : (
            <div className="animate-slide-up">
              {/* Parking Results List */}
              <div className="space-y-4">
                {filteredAndSortedResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center surface-glass border border-secondary-200 dark:border-[#4d4635] rounded-2xl bg-white/50 dark:bg-[#110e07]/50">
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
                    <div key={spot.id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white dark:bg-[#1a1712] border border-secondary-200 dark:border-[#4d4635] rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(242,202,80,0.1)] transition-all duration-300 group">
                      <div className="flex items-start gap-5 w-full sm:w-auto">
                        <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-[#f2ca50]/10 border border-primary-100 dark:border-[#f2ca50]/20 flex items-center justify-center shrink-0">
                          <span className="text-[28px]">🅿</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-secondary-900 dark:text-[#eae1d4] group-hover:text-primary-600 dark:group-hover:text-[#f2ca50] transition-colors">{spot.name}</h3>
                            <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#110e07] px-2 py-0.5 rounded-md text-xs font-bold text-secondary-700 dark:text-[#eae1d4]">
                              <span className="material-symbols-outlined text-[14px] text-warning-500">star</span>
                              {spot.rating} <span className="text-secondary-400 font-normal">({spot.reviews})</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-[#d0c5af] mt-1.5">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">distance</span> {spot.distanceKm} km away</span>
                            <span className="w-1 h-1 rounded-full bg-secondary-300 dark:bg-[#4d4635]"></span>
                            <span className="flex items-center gap-1 text-success-600 dark:text-success-400 font-medium"><span className="material-symbols-outlined text-[16px]">local_parking</span> {spot.availableSpots} spots available</span>
                          </div>
                          
                          {/* Spot Amenities Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {spot.amenities.slice(0, 3).map((amenity) => (
                              <span key={amenity} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-secondary-50 dark:bg-[#252119] text-secondary-500 dark:text-[#d0c5af] rounded-md border border-secondary-200 dark:border-[#4d4635]/50">
                                {amenity}
                              </span>
                            ))}
                            {spot.amenities.length > 3 && (
                              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-secondary-50 dark:bg-[#252119] text-secondary-500 dark:text-[#d0c5af] rounded-md border border-secondary-200 dark:border-[#4d4635]/50">
                                +{spot.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto self-stretch sm:self-auto border-t sm:border-t-0 border-secondary-200 dark:border-[#4d4635] pt-4 sm:pt-0">
                        <div className="text-right">
                          <div className="text-xs text-secondary-500 dark:text-[#d0c5af] font-semibold uppercase tracking-wider mb-1">Total for {durationHours} hrs</div>
                          <div className="text-xl font-bold text-secondary-900 dark:text-[#eae1d4]">₹{spot.pricePerHour * durationHours}</div>
                          <div className="text-xs text-secondary-500 dark:text-[#d0c5af] mt-0.5">₹{spot.pricePerHour}/hr</div>
                        </div>
                        <button className="gold-glow-button mt-0 sm:mt-4 px-6 py-2.5 rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-[#f2ca50] dark:hover:bg-[#fceb96] dark:text-[#3c2f00] font-bold text-sm transition-all shadow-sm dark:shadow-[0_0_10px_rgba(242,202,80,0.3)]">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
