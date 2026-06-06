// ============================================================
// Landing Page — How It Works Section
// ============================================================
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title:  'Search',
    description: 'Enter your destination and date. Browse available parking spots on our interactive map.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: '02',
    title:  'Compare & Book',
    description: 'Compare prices, amenities and distance. Select your slot and confirm with one tap.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title:  'Pay & Park',
    description: 'Pay securely via UPI, cards, or wallets. Show your digital pass at the parking spot and drive in.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-pad bg-secondary-50"
      aria-labelledby="how-heading"
    >
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Simple Process
          </p>
          <h2 id="how-heading" className="text-display-md text-secondary-900 text-balance">
            Parked in 3 easy steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Connector Line */}
          <div
            className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              {/* Step Icon */}
              <div className={cn(
                'relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
                'bg-primary-600 text-white shadow-md',
                'transition-transform duration-200 hover:scale-105',
              )}>
                {step.icon}
                <span className={cn(
                  'absolute -top-2 -right-2 w-6 h-6 rounded-full',
                  'bg-white border-2 border-primary-200',
                  'text-xs font-bold text-primary-600',
                  'flex items-center justify-center',
                )}>
                  {index + 1}
                </span>
              </div>

              <h3 className="text-heading-md text-secondary-900 mb-3">{step.title}</h3>
              <p className="text-body-sm text-secondary-500 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
