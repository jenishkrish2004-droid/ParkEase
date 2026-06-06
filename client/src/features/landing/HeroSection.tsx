// ============================================================
// Landing Page — Hero Section
// ============================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const popularLocations = [
  'Connaught Place, Delhi',
  'MG Road, Bangalore',
  'Bandra, Mumbai',
  'Anna Salai, Chennai',
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-2xl opacity-40 -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="container-app relative">
        <div className="py-20 lg:py-28 xl:py-32">
          <div className="max-w-4xl">
            {/* Announcement Badge */}
            <div className="inline-flex mb-6 animate-fade-in">
              <Badge variant="primary" size="md" rounded dot>
                🎉 Now available in 100+ cities across India
              </Badge>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-display-lg lg:text-[4rem] xl:text-[4.5rem] font-display font-bold text-secondary-900 text-balance leading-[1.05] tracking-tight animate-fade-in delay-75"
            >
              Find & Book{' '}
              <span className="text-primary-600 relative">
                Parking
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 10C50 4 150 1 298 6" stroke="#BFDBFE" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              Instantly
            </h1>

            <p className="mt-7 text-body-lg text-secondary-500 max-w-2xl text-pretty animate-fade-in delay-100">
              Discover <strong className="text-secondary-700 font-semibold">verified parking spots</strong> near any
              location. Book in seconds, pay securely, and never circle the block again.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-2xl animate-slide-up delay-150">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl border border-secondary-200 shadow-elevated">
                {/* Location Input */}
                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-4 text-secondary-400" aria-hidden="true">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, landmark, or address..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent text-secondary-900 placeholder:text-secondary-400 text-sm focus:outline-none"
                    aria-label="Search parking location"
                    id="hero-search"
                  />
                </div>

                {/* Date/Time (placeholder) */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-3 border-l border-secondary-200">
                  <svg className="w-4 h-4 text-secondary-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-secondary-400 whitespace-nowrap">Any time</span>
                </div>

                {/* Search Button */}
                <Link
                  to={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className={cn(
                    'shrink-0 inline-flex items-center justify-center gap-2',
                    'px-6 py-3 rounded-xl font-semibold text-sm',
                    'bg-primary-600 text-white hover:bg-primary-700',
                    'transition-colors shadow-sm hover:shadow-md no-underline',
                  )}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                  </svg>
                  Search
                </Link>
              </div>

              {/* Popular Locations */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-xs text-secondary-400 font-medium">Popular:</span>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSearchQuery(loc)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border border-secondary-200',
                      'text-secondary-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50',
                      'transition-all duration-150 cursor-pointer',
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 mt-10 animate-fade-in delay-200">
              {[
                { icon: '✓', text: 'No booking fees'  },
                { icon: '🔒', text: 'Secure payments'  },
                { icon: '⭐', text: '4.8/5 rating'    },
                { icon: '📍', text: '10,000+ spots'   },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm text-secondary-500 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
