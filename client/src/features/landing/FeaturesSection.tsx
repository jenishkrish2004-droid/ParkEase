// ============================================================
// Landing Page — Stats & Features Sections
// ============================================================
import { cn } from '@/lib/utils';

// ── Stats Section ────────────────────────────────────────────
const stats = [
  { value: '10,000+', label: 'Verified Parking Spots', icon: '🅿️' },
  { value: '50,000+', label: 'Happy Drivers',          icon: '😊' },
  { value: '100+',    label: 'Cities Covered',         icon: '🏙️' },
  { value: '4.8★',    label: 'Average Rating',         icon: '⭐' },
];

export function StatsSection() {
  return (
    <section className="border-y border-secondary-100 bg-secondary-50" aria-label="Platform statistics">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-2xl mb-2" aria-hidden="true">{stat.icon}</div>
              <div className="text-display-sm font-bold text-secondary-900 font-display">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-secondary-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Section ─────────────────────────────────────────
const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color:  'bg-blue-50 text-blue-600',
    title:  'Find Nearby Spots',
    description:
      'Search by location, address, or landmark. Our live map shows real-time availability so you never waste time.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color:  'bg-purple-50 text-purple-600',
    title:  'Book in Seconds',
    description:
      'Select your time slot and confirm instantly. Receive a digital pass directly on your phone.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color:  'bg-green-50 text-green-600',
    title:  'Pay Securely',
    description:
      'Pay via UPI, cards, or wallets. Powered by Razorpay with end-to-end encryption. No hidden charges.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color:  'bg-orange-50 text-orange-600',
    title:  'Verified & Safe',
    description:
      'All parking spots are verified by our team. Rated by thousands of real drivers. Your safety is our priority.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color:  'bg-teal-50 text-teal-600',
    title:  '24/7 Availability',
    description:
      'Park anytime. Our platform is available round the clock with real-time customer support.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    color:  'bg-rose-50 text-rose-600',
    title:  'Earn as an Owner',
    description:
      'Have a parking space? List it on ParkEase and earn passive income. Setup takes under 10 minutes.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-pad" aria-labelledby="features-heading">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Why ParkEase?
          </p>
          <h2 id="features-heading" className="text-display-md text-secondary-900 text-balance">
            Everything you need for stress-free parking
          </h2>
          <p className="mt-4 text-body-md text-secondary-500">
            From finding a spot to paying — we've made the entire experience seamless.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                'group p-6 rounded-2xl border border-secondary-100 bg-white',
                'hover:border-secondary-200 hover:shadow-elevated',
                'transition-all duration-200 hover:-translate-y-0.5',
              )}
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.color)}>
                {feature.icon}
              </div>
              <h3 className="text-heading-sm text-secondary-900 mb-2">{feature.title}</h3>
              <p className="text-body-sm text-secondary-500 leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
