// ============================================================
// Landing Page — Hero Section (Premium Theme Support)
// ============================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const popularLocations = [
  'Connaught Place, Delhi',
  'MG Road, Bangalore',
  'Bandra, Mumbai',
  'Anna Salai, Chennai',
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  // Add floating glow animation effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glows = document.querySelectorAll('.floating-glow') as NodeListOf<HTMLElement>;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      glows.forEach((glow, index) => {
        const speed = (index + 1) * 0.1;
        glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-white dark:bg-[#110e07] text-secondary-900 dark:text-[#eae1d4] min-h-[90vh] flex items-center transition-colors duration-300"
      aria-labelledby="hero-heading"
    >
      {/* Global Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-300 dark:bg-[#f2ca50] opacity-10 dark:opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-primary-500 dark:bg-[#d4af37] opacity-10 dark:opacity-10 blur-[120px] rounded-full floating-glow pointer-events-none" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-primary-200 dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.08] blur-[100px] rounded-full floating-glow pointer-events-none" style={{ animationDelay: '-7s' }}></div>

      <div className="container-app relative z-10">
        <div className="py-20 lg:py-28 xl:py-32">
          <div className="max-w-4xl">
            {/* Announcement Badge */}
            <div className="inline-flex mb-8 animate-fade-in">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 dark:bg-[#f2ca50]/10 border border-primary-200 dark:border-[#f2ca50]/20 text-primary-700 dark:text-[#f2ca50] text-xs tracking-widest uppercase font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(242,202,80,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-[#f2ca50] mr-2 animate-pulse" />
                Now available in 100+ cities across India
              </span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-display-lg lg:text-[4rem] xl:text-[4.5rem] font-display font-bold text-secondary-900 dark:text-[#eae1d4] text-balance leading-[1.05] tracking-tight animate-fade-in delay-75"
            >
              Find & Book{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 dark:from-[#fceb96] dark:to-[#d4af37] relative">
                Parking
              </span>{' '}
              Instantly
            </h1>

            <p className="mt-7 text-body-lg text-secondary-600 dark:text-[#d0c5af] max-w-2xl text-pretty animate-fade-in delay-100">
              Discover <strong className="text-primary-600 dark:text-[#f2ca50] font-semibold">verified parking spots</strong> near any
              location. Book in seconds, pay securely, and never circle the block again.
            </p>

            {/* Search Bar */}
            <div className="mt-12 max-w-2xl animate-slide-up delay-150">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/60 dark:bg-transparent dark:surface-glass rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-xl dark:shadow-2xl relative z-10 backdrop-blur-2xl">
                {/* Location Input */}
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

                {/* Date/Time (placeholder) */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-3 border-l border-secondary-200 dark:border-[#4d4635]">
                  <span className="material-symbols-outlined text-[18px] text-secondary-400 dark:text-[#d0c5af]">calendar_today</span>
                  <span className="text-sm text-secondary-500 dark:text-[#d0c5af] whitespace-nowrap">Any time</span>
                </div>

                {/* Search Button */}
                <Link
                  to={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className={cn(
                    'shrink-0 inline-flex items-center justify-center gap-2',
                    'px-8 py-3 rounded-xl font-bold text-sm group',
                    'bg-primary-500 hover:bg-primary-600 text-white dark:bg-[#f2ca50] dark:text-[#3c2f00] dark:hover:bg-[#fceb96]',
                    'transition-all duration-300 no-underline shadow-md dark:shadow-[0_0_15px_rgba(242,202,80,0.5)]',
                  )}
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">search</span>
                  Search
                </Link>
              </div>

              {/* Popular Locations */}
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <span className="text-xs text-secondary-500 dark:text-[#d0c5af] font-medium tracking-wide uppercase mr-2">Popular:</span>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSearchQuery(loc)}
                    className={cn(
                      'text-xs px-4 py-2 rounded-full border border-secondary-200 dark:border-[#4d4635]/60 bg-white/50 dark:bg-[#110e07]/50',
                      'text-secondary-600 dark:text-[#d0c5af] hover:border-primary-300 dark:hover:border-[#f2ca50]/50 hover:text-primary-600 dark:hover:text-[#fceb96] hover:bg-primary-50 dark:hover:bg-[#f2ca50]/10',
                      'transition-all duration-300 cursor-pointer backdrop-blur-md',
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-8 mt-12 animate-fade-in delay-200">
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
