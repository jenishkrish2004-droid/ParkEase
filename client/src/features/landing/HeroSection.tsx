// ============================================================
// Landing Page — Hero Section (Premium Theme Support)
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DatePickerPopup } from '@/components/ui/DatePickerPopup';
import { useAuth } from '@/app/providers/AuthProvider';

const popularLocations = [
  'Connaught Place, Delhi',
  'MG Road, Bangalore',
  'Bandra, Mumbai',
  'Anna Salai, Chennai',
];

const popularRoutes = [
  { from: 'Nagercoil', to: 'Chennai' },
  { from: 'Bangalore', to: 'Mysore' },
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Delhi', to: 'Jaipur' },
];

export function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState(new Date().toISOString());
  const [searchMode, setSearchMode] = useState<'parking' | 'ev'>('parking');
  const [evSource, setEvSource] = useState('');
  const [evDestination, setEvDestination] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigate = useNavigate();
  const dateContainerRef = useRef<HTMLDivElement>(null);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 17 ? 'Good afternoon' :
    'Good evening';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateContainerRef.current && !dateContainerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchMode === 'parking') {
      if (!searchQuery.trim()) {
        setErrorMsg('Please enter a location to search.');
        return;
      }
      setErrorMsg('');
      const queryParams = new URLSearchParams();
      queryParams.set('q', searchQuery);
      if (searchDate) {
        queryParams.set('date', searchDate);
      }
      navigate(`/search?${queryParams.toString()}`);
    } else {
      if (!evSource.trim() || !evDestination.trim()) {
        setErrorMsg('Please enter both source and destination.');
        return;
      }
      setErrorMsg('');
      const queryParams = new URLSearchParams();
      queryParams.set('from', evSource);
      queryParams.set('to', evDestination);
      navigate(`/ev-route?${queryParams.toString()}`);
    }
  };

  // Floating glow animation moved to LandingPage for global effect

  return (
    <section
      className="relative z-10 text-secondary-900 dark:text-[#eae1d4] min-h-[75vh] flex items-center justify-center w-full transition-colors duration-300"
      aria-labelledby="hero-heading"
    >
      <div className="container-app relative z-10 -translate-y-16 lg:-translate-y-24 w-full">
        <div className="pt-20 pb-10 lg:pt-28 lg:pb-12 xl:pt-32 xl:pb-16">
          <div className="w-full mx-auto text-center">
            {/* Announcement Badge */}
            {!isAuthenticated && (
              <div className="flex justify-center mb-8 animate-fade-in">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 dark:bg-[#f2ca50]/10 border border-primary-200 dark:border-[#f2ca50]/20 text-primary-700 dark:text-[#f2ca50] text-xs tracking-widest uppercase font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(242,202,80,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-[#f2ca50] mr-2 animate-pulse" />
                  Now available in 100+ cities across India
                </span>
              </div>
            )}

            {/* Personalized Greeting */}
            {isAuthenticated && user && (
              <div className="font-display text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37] tracking-tight mb-6 animate-fade-in">
                {greeting}, {user.firstName}!
              </div>
            )}

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-display-lg lg:text-[3.75rem] xl:text-[4.25rem] font-display font-bold text-secondary-900 dark:text-[#eae1d4] leading-[1.05] tracking-tight animate-fade-in delay-75 whitespace-nowrap mx-auto"
            >
              Smart{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 dark:from-[#fceb96] dark:to-[#d4af37] relative">
                Parking
              </span>{' '}
              &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 relative">
                EV Charging
              </span>{' '}
              Platform
            </h1>

            <p className="mt-7 text-body-lg text-secondary-600 dark:text-[#d0c5af] max-w-2xl mx-auto text-pretty animate-fade-in delay-100">
              Discover <strong className="text-primary-600 dark:text-[#f2ca50] font-semibold">verified parking spots and EV charging stations</strong> near any
              location. Book in seconds and travel worry-free.
            </p>

            {/* Search Bar */}
            <div className="mt-12 max-w-2xl mx-auto animate-slide-up delay-150 relative">
              {/* Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex p-1.5 bg-white/60 dark:bg-[#1a1712]/80 backdrop-blur-md rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-sm relative">
                  {/* Sliding Background */}
                  <div 
                    className={cn(
                      "absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-xl transition-all duration-300 ease-in-out shadow-sm",
                      searchMode === 'parking' 
                        ? "left-1.5 bg-primary-500 dark:bg-[#f2ca50]" 
                        : "left-[calc(50%+0.375rem)] bg-emerald-500 dark:bg-emerald-400"
                    )}
                  />
                  
                  <button
                    onClick={() => { setSearchMode('parking'); setErrorMsg(''); }}
                    className={cn(
                      "relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors w-40",
                      searchMode === 'parking' ? "text-white dark:text-[#3c2f00]" : "text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-[#eae1d4]"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">local_parking</span>
                    Parking
                  </button>
                  <button
                    onClick={() => { setSearchMode('ev'); setErrorMsg(''); }}
                    className={cn(
                      "relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors w-40",
                      searchMode === 'ev' ? "text-white dark:text-[#064e3b]" : "text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-[#eae1d4]"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">electric_car</span>
                    EV Routes
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="absolute -top-4 left-0 right-0 max-w-max mx-auto bg-danger-500/10 border border-danger-500/20 text-danger-600 dark:text-danger-400 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm z-20">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/60 dark:bg-transparent dark:surface-glass rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-xl dark:shadow-2xl relative z-10 backdrop-blur-2xl transition-all duration-300">
                {searchMode === 'parking' ? (
                  <>
                    {/* Location Input (Parking) */}
                    <div className="flex-1 relative flex items-center group/input">
                      <span className="absolute left-4 text-secondary-400 dark:text-[#d0c5af] group-focus-within/input:text-primary-600 dark:group-focus-within/input:text-[#f2ca50] transition-colors" aria-hidden="true">
                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by location, landmark, or address..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent text-secondary-900 dark:text-[#eae1d4] placeholder:text-secondary-400 dark:placeholder:text-[#d0c5af]/70 text-sm focus:outline-none focus:ring-0 border-none"
                        aria-label="Search parking location"
                        id="hero-search"
                      />
                    </div>

                    {/* Date/Time Custom Picker */}
                    <div 
                      ref={dateContainerRef}
                      className="hidden sm:flex items-center gap-2 px-4 py-3 border-l border-secondary-200 dark:border-[#4d4635] relative group/date cursor-pointer"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <span className={cn(
                        "material-symbols-outlined text-[18px] transition-colors",
                        showDatePicker ? "text-primary-600 dark:text-[#f2ca50]" : "text-secondary-400 dark:text-[#d0c5af] group-hover/date:text-primary-600 dark:group-hover/date:text-[#f2ca50]"
                      )}>calendar_today</span>
                      <div className="text-sm text-secondary-500 dark:text-[#d0c5af] whitespace-nowrap pointer-events-none">
                        {searchDate ? new Date(searchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Any time'}
                      </div>
                      
                      {showDatePicker && (
                        <DatePickerPopup 
                          selectedDate={searchDate} 
                          onSelectDate={setSearchDate} 
                          onClose={() => setShowDatePicker(false)} 
                          className="absolute bottom-full mb-3 left-0 sm:left-auto sm:right-0 animate-slide-up origin-bottom"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* From Input (EV) */}
                    <div className="flex-1 relative flex items-center group/input border-b sm:border-b-0 sm:border-r border-secondary-200 dark:border-[#4d4635] pb-2 mb-2 sm:pb-0 sm:mb-0">
                      <span className="absolute left-4 text-secondary-400 dark:text-[#d0c5af] group-focus-within/input:text-emerald-500 dark:group-focus-within/input:text-emerald-400 transition-colors" aria-hidden="true">
                        <span className="material-symbols-outlined text-[20px]">trip_origin</span>
                      </span>
                      <input
                        type="text"
                        value={evSource}
                        onChange={(e) => setEvSource(e.target.value)}
                        placeholder="From (e.g. Nagercoil)"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent text-secondary-900 dark:text-[#eae1d4] placeholder:text-secondary-400 dark:placeholder:text-[#d0c5af]/70 text-sm focus:outline-none focus:ring-0 border-none"
                        aria-label="Starting location"
                      />
                    </div>
                    {/* To Input (EV) */}
                    <div className="flex-1 relative flex items-center group/input2">
                      <span className="absolute left-4 text-secondary-400 dark:text-[#d0c5af] group-focus-within/input2:text-emerald-500 dark:group-focus-within/input2:text-emerald-400 transition-colors" aria-hidden="true">
                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                      </span>
                      <input
                        type="text"
                        value={evDestination}
                        onChange={(e) => setEvDestination(e.target.value)}
                        placeholder="To (e.g. Chennai)"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent text-secondary-900 dark:text-[#eae1d4] placeholder:text-secondary-400 dark:placeholder:text-[#d0c5af]/70 text-sm focus:outline-none focus:ring-0 border-none"
                        aria-label="Destination"
                      />
                    </div>
                  </>
                )}

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className={cn(
                    'shrink-0 inline-flex items-center justify-center gap-2',
                    'px-8 py-3 rounded-xl font-bold text-sm group',
                    'transition-all duration-300 no-underline shadow-md border-none',
                    searchMode === 'parking'
                      ? 'bg-primary-500 hover:bg-primary-600 text-white dark:bg-[#f2ca50] dark:text-[#3c2f00] dark:hover:bg-[#fceb96] dark:shadow-[0_0_15px_rgba(242,202,80,0.5)]'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-400 dark:text-[#064e3b] dark:hover:bg-emerald-300 dark:shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                  )}
                >
                  <span className={cn("material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform", searchMode === 'ev' && "rotate-90")}>
                    {searchMode === 'parking' ? 'search' : 'route'}
                  </span>
                  {searchMode === 'parking' ? 'Search' : 'Find Route'}
                </button>
              </div>

              {/* Popular Locations / Routes */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                <span className="text-xs text-secondary-500 dark:text-[#d0c5af] font-medium tracking-wide uppercase mr-2">Popular:</span>
                {searchMode === 'parking' ? (
                  popularLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSearchQuery(loc);
                        setErrorMsg('');
                      }}
                      className={cn(
                        'text-xs px-4 py-2 rounded-full border border-secondary-200 dark:border-[#4d4635]/60 bg-white/50 dark:bg-[#110e07]/50',
                        'text-secondary-600 dark:text-[#d0c5af] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 hover:text-primary-600 dark:hover:text-[#fceb96] hover:bg-primary-50 dark:hover:bg-[#f2ca50]/10',
                        'transition-all duration-300 cursor-pointer backdrop-blur-md',
                      )}
                    >
                      {loc}
                    </button>
                  ))
                ) : (
                  popularRoutes.map((route) => (
                    <button
                      key={`${route.from}-${route.to}`}
                      type="button"
                      onClick={() => {
                        setEvSource(route.from);
                        setEvDestination(route.to);
                        setErrorMsg('');
                      }}
                      className={cn(
                        'text-xs px-4 py-2 rounded-full border border-secondary-200 dark:border-[#4d4635]/60 bg-white/50 dark:bg-[#110e07]/50',
                        'text-secondary-600 dark:text-[#d0c5af] hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
                        'transition-all duration-300 cursor-pointer backdrop-blur-md flex items-center gap-1',
                      )}
                    >
                      {route.from} <span className="material-symbols-outlined text-[14px]">arrow_forward</span> {route.to}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 animate-fade-in delay-200">
              {[
                { icon: 'task_alt', text: 'No booking fees'  },
                { icon: 'shield_lock', text: 'Secure payments'  },
                { icon: 'star', text: '4.8/5 rating'    },
                { icon: 'local_parking', text: '10,000+ spots'   },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-[20px] text-primary-500 dark:text-[#f2ca50] group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-sm text-secondary-600 dark:text-[#d0c5af] font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
