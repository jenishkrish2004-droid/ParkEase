// ============================================================
// Landing Page — Testimonials & CTA Sections (Premium Theme)
// ============================================================
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

// ── Testimonials ─────────────────────────────────────────────
const testimonials = [
  {
    quote:
      'ParkEase saved me 20 minutes every day commuting to office. The booking process is incredibly smooth and I love the instant confirmation.',
    name:      'Priya Sharma',
    role:      'Software Engineer, Bangalore',
    rating:    5,
    firstName: 'Priya',
    lastName:  'Sharma',
  },
  {
    quote:
      'As a parking lot owner, I was losing money on empty spots. With ParkEase I earn ₹15,000+ extra every month. Setup took under 10 minutes!',
    name:      'Rajesh Kumar',
    role:      'Parking Owner, Delhi',
    rating:    5,
    firstName: 'Rajesh',
    lastName:  'Kumar',
  },
  {
    quote:
      'Finally an app that shows real-time availability! No more driving around looking for parking. The map view is brilliant.',
    name:      'Ananya Patel',
    role:      'Marketing Manager, Mumbai',
    rating:    5,
    firstName: 'Ananya',
    lastName:  'Patel',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn('material-symbols-outlined text-[18px]', i < count ? 'text-[#f2ca50]' : 'text-[#4d4635]')}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-pad relative z-10 transition-colors duration-300" aria-labelledby="testimonials-heading">
      <div className="container-app relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-primary-600 dark:text-[#f2ca50] uppercase tracking-[0.2em] mb-4">
            Loved by drivers & owners
          </p>
          <h2 id="testimonials-heading" className="text-display-md font-display font-bold text-secondary-900 dark:text-[#eae1d4] text-balance tracking-tight">
            What our users say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className={cn(
                'group p-8 rounded-2xl border border-secondary-200 dark:border-[#4d4635]/50 bg-white dark:bg-[#110e07]',
                'hover:border-primary-300 dark:hover:border-[#f2ca50]/30 hover:bg-secondary-50 dark:hover:bg-[#1a1710] hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(242,202,80,0.05)]',
                'transition-all duration-300 hover:-translate-y-1',
                'flex flex-col relative overflow-hidden',
              )}
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                <span className="material-symbols-outlined text-[100px] text-primary-600 dark:text-[#f2ca50]">format_quote</span>
              </div>
              
              <StarRating count={t.rating} />

              <blockquote className="mt-6 flex-1 relative z-10">
                <p className="text-body-md text-secondary-600 dark:text-[#d0c5af] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 relative z-10 pt-6 border-t border-secondary-100 dark:border-[#4d4635]/30">
                <Avatar firstName={t.firstName} lastName={t.lastName} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight text-secondary-900 dark:text-[#eae1d4] truncate">{t.name}</p>
                  <p className="text-xs text-secondary-500 dark:text-[#d0c5af] truncate">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ──────────────────────────────────────────────
export function CTASection() {
  return (
    <section
      className="section-pad relative z-10 transition-colors duration-300"
      aria-labelledby="cta-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white dark:bg-[#f2ca50] opacity-10 dark:opacity-[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-300 dark:bg-[#d4af37] opacity-20 dark:opacity-[0.06] blur-[100px] rounded-full" />
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="cta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" className="text-secondary-300 dark:text-[#f2ca50]" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="container-app relative text-center z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex mb-8">
             <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 dark:bg-[#f2ca50]/10 border border-primary-200 dark:border-[#f2ca50]/20 text-primary-700 dark:text-[#f2ca50] text-xs tracking-widest uppercase font-semibold">
                🚀 Get started for free
             </span>
          </div>

          <h2
            id="cta-heading"
            className="text-display-md text-secondary-900 dark:text-[#eae1d4] text-balance font-display font-bold tracking-tight"
          >
            Stop wasting time looking for parking
          </h2>

          <p className="mt-6 text-lg text-secondary-600 dark:text-[#d0c5af] max-w-xl mx-auto leading-relaxed">
            Join 50,000+ drivers who book parking effortlessly every day.
            No subscription needed — pay only when you park.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/register"
              className={cn(
                'gold-glow-button w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl',
                'font-bold text-base text-[#3c2f00]',
                'transition-all duration-300 no-underline shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(242,202,80,0.2)] dark:hover:shadow-[0_0_30px_rgba(242,202,80,0.4)]',
              )}
            >
              Find Parking Now
            </Link>
            <Link
              to="/owner"
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl',
                'font-bold text-base text-secondary-900 dark:text-[#f2ca50]',
                'border border-secondary-300 dark:border-[#f2ca50]/30 hover:bg-secondary-50 dark:hover:bg-[#f2ca50]/10 hover:border-secondary-400 dark:hover:border-[#f2ca50]/60',
                'transition-all duration-300 no-underline',
              )}
            >
              List Your Space →
            </Link>
          </div>

          {/* Micro Social Proof */}
          <p className="mt-10 text-xs font-medium tracking-wide text-secondary-500 dark:text-[#d0c5af]/60">
            Free to sign up · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
