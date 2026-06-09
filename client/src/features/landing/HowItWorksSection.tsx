// ============================================================
// Landing Page — How It Works Section (Premium Theme)
// ============================================================
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title:  'Search',
    description: 'Enter your destination and date. Browse available parking spots on our interactive map.',
    icon: 'search',
  },
  {
    number: '02',
    title:  'Compare & Book',
    description: 'Compare prices, amenities and distance. Select your slot and confirm with one tap.',
    icon: 'rule',
  },
  {
    number: '03',
    title:  'Pay & Park',
    description: 'Pay securely via UPI, cards, or wallets. Show your digital pass at the parking spot and drive in.',
    icon: 'payments',
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-pad relative z-10 transition-colors duration-300"
      aria-labelledby="how-heading"
    >
      <div className="container-app relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-primary-600 dark:text-[#f2ca50] uppercase tracking-[0.2em] mb-4">
            Simple Process
          </p>
          <h2 id="how-heading" className="text-display-md font-display font-bold text-secondary-900 dark:text-[#eae1d4] text-balance tracking-tight">
            Parked in 3 easy steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {/* Connector Line */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-[2px] bg-gradient-to-r from-transparent via-primary-300 dark:via-[#f2ca50]/30 to-transparent"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center group">
              {/* Step Icon */}
              <div className={cn(
                'relative w-20 h-20 rounded-2xl flex items-center justify-center mb-8',
                'bg-secondary-50 border border-secondary-200 text-primary-600 shadow-md',
                'dark:bg-[#1a1710] dark:border-[#f2ca50]/20 dark:text-[#f2ca50] dark:shadow-[0_0_20px_rgba(242,202,80,0.1)]',
                'transition-all duration-300 group-hover:scale-110 group-hover:border-primary-400 group-hover:bg-primary-50',
                'dark:group-hover:border-[#f2ca50]/50 dark:group-hover:bg-[#f2ca50]/10',
              )}>
                <span className="material-symbols-outlined text-[36px]">{step.icon}</span>
                <span className={cn(
                  'absolute -top-3 -right-3 w-8 h-8 rounded-full',
                  'bg-white border-2 border-primary-200',
                  'dark:bg-[#110e07] dark:border-[#f2ca50]/40',
                  'text-xs font-bold text-primary-700 dark:text-[#fceb96]',
                  'flex items-center justify-center shadow-lg',
                  'transition-colors duration-300 group-hover:border-primary-500 dark:group-hover:border-[#f2ca50]',
                )}>
                  {index + 1}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display tracking-tight text-secondary-900 dark:text-[#eae1d4] mb-4 group-hover:text-primary-700 dark:group-hover:text-[#fceb96] transition-colors">{step.title}</h3>
              <p className="text-sm text-secondary-600 dark:text-[#d0c5af] max-w-xs leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
