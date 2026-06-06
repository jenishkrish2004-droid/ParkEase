// ============================================================
// Landing Page — Testimonials & CTA Sections
// ============================================================
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

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
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('w-4 h-4', i < count ? 'text-amber-400' : 'text-secondary-200')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-pad bg-white" aria-labelledby="testimonials-heading">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Loved by drivers & owners
          </p>
          <h2 id="testimonials-heading" className="text-display-md text-secondary-900 text-balance">
            What our users say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className={cn(
                'group p-6 rounded-2xl border border-secondary-100 bg-white',
                'hover:border-primary-200 hover:shadow-elevated',
                'transition-all duration-200 hover:-translate-y-0.5',
                'flex flex-col',
              )}
            >
              <StarRating count={t.rating} />

              <blockquote className="mt-4 flex-1">
                <p className="text-sm text-secondary-600 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar firstName={t.firstName} lastName={t.lastName} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-secondary-900 truncate">{t.name}</p>
                  <p className="text-xs text-secondary-500 truncate">{t.role}</p>
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
      className="section-pad bg-primary-600 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full blur-2xl opacity-40 -translate-x-1/3 translate-y-1/3" />
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="cta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="container-app relative text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="border-primary-400 text-primary-100 mb-6">
            🚀 Get started for free
          </Badge>

          <h2
            id="cta-heading"
            className="text-display-md text-white text-balance font-display font-bold"
          >
            Stop wasting time looking for parking
          </h2>

          <p className="mt-5 text-lg text-primary-100 max-w-xl mx-auto">
            Join 50,000+ drivers who book parking effortlessly every day.
            No subscription needed — pay only when you park.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className={cn(
                'inline-flex items-center justify-center px-6 py-3 rounded-xl',
                'font-semibold text-base text-primary-600',
                'bg-white hover:bg-primary-50',
                'shadow-lg hover:shadow-xl transition-all duration-200',
                'no-underline',
              )}
            >
              Find Parking Now
            </Link>
            <Link
              to="/owner/register"
              className={cn(
                'inline-flex items-center justify-center px-6 py-3 rounded-xl',
                'font-medium text-base text-white',
                'border border-primary-400 hover:bg-primary-700 hover:border-primary-300',
                'transition-all duration-200 no-underline',
              )}
            >
              List Your Space →
            </Link>
          </div>

          {/* Micro Social Proof */}
          <p className="mt-8 text-sm text-primary-200">
            Free to sign up · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
