// ============================================================
// Landing Page — Stats & Features Sections (Premium Theme)
// ============================================================
import { cn } from '@/lib/utils';

// ── Stats Section ────────────────────────────────────────────
const stats = [
  { value: '10,000+', label: 'Verified Parking Spots', icon: 'local_parking' },
  { value: '50,000+', label: 'Happy Drivers',          icon: 'sentiment_very_satisfied' },
  { value: '100+',    label: 'Cities Covered',         icon: 'location_city' },
  { value: '4.8★',    label: 'Average Rating',         icon: 'star' },
];

export function StatsSection() {
  return (
    <section className="relative z-10 transition-colors duration-300" aria-label="Platform statistics">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="mb-3 flex justify-center text-primary-500 dark:text-[#f2ca50] group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                <span className="material-symbols-outlined text-[40px] drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(242,202,80,0.4)]">{stat.icon}</span>
              </div>
              <div className="text-display-sm font-bold text-secondary-900 dark:text-[#eae1d4] font-display tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm font-medium tracking-wide text-secondary-600 dark:text-[#d0c5af]">{stat.label}</div>
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
    icon: 'location_on',
    title:  'Find Nearby Spots',
    description:
      'Search by location, address, or landmark. Our live map shows real-time availability so you never waste time.',
  },
  {
    icon: 'bolt',
    title:  'Book in Seconds',
    description:
      'Select your time slot and confirm instantly. Receive a digital pass directly on your phone.',
  },
  {
    icon: 'shield_lock',
    title:  'Pay Securely',
    description:
      'Pay via UPI, cards, or wallets. Powered by Razorpay with end-to-end encryption. No hidden charges.',
  },
  {
    icon: 'verified_user',
    title:  'Verified & Safe',
    description:
      'All parking spots are verified by our team. Rated by thousands of real drivers. Your safety is our priority.',
  },
  {
    icon: 'schedule',
    title:  '24/7 Availability',
    description:
      'Park anytime. Our platform is available round the clock with real-time customer support.',
  },
  {
    icon: 'monetization_on',
    title:  'Earn as an Owner',
    description:
      'Have a parking space? List it on ParkEase and earn passive income. Setup takes under 10 minutes.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-pad relative z-10 transition-colors duration-300" aria-labelledby="features-heading">
      {/* Subtle Background Elements */}
      <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-primary-400 dark:bg-[#d4af37] opacity-[0.05] dark:opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-primary-300 dark:bg-[#fceb96] opacity-[0.05] dark:opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container-app relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-primary-600 dark:text-[#f2ca50] uppercase tracking-[0.2em] mb-4">
            Why ParkEase?
          </p>
          <h2 id="features-heading" className="text-display-md font-display font-bold text-secondary-900 dark:text-[#eae1d4] text-balance tracking-tight">
            Everything you need for stress-free parking
          </h2>
          <p className="mt-5 text-body-md text-secondary-600 dark:text-[#d0c5af] leading-relaxed">
            From finding a spot to paying — we've made the entire experience seamless.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                'group p-8 rounded-2xl border border-secondary-200 dark:border-[#4d4635]/50 bg-white dark:bg-[#110e07]',
                'hover:border-primary-300 dark:hover:border-[#f2ca50]/40 hover:bg-secondary-50 dark:hover:bg-[#1a1710] hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(242,202,80,0.05)]',
                'transition-all duration-300 hover:-translate-y-1',
              )}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-primary-100 text-primary-600 dark:bg-[#f2ca50]/10 dark:text-[#f2ca50] group-hover:scale-110 group-hover:bg-primary-200 dark:group-hover:bg-[#f2ca50]/20 transition-all duration-300">
                <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold font-display tracking-tight text-secondary-900 dark:text-[#eae1d4] mb-3 group-hover:text-primary-700 dark:group-hover:text-[#fceb96] transition-colors">{feature.title}</h3>
              <p className="text-sm text-secondary-600 dark:text-[#d0c5af] leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
