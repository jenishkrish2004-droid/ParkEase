// ============================================================
// Dashboard Placeholder Page (Phase 2.5+)
// ============================================================
// Placeholder shown after login until Phase 4 (Profile) and
// Phase 18 (Owner Dashboard) are implemented.
// Uses the global Header (auth-aware) instead of a custom one.
// ============================================================

import { useAuth } from '@/app/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { VerificationBadge } from '@/features/user/VerificationBadge';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 17 ? 'Good afternoon' :
    'Good evening';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Main */}
      <main className="container-app py-12">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-secondary-900">
              {greeting}, {user.firstName}! 👋
            </h1>
            <VerificationBadge status={user.verificationStatus} />
          </div>
          <p className="text-secondary-500 mt-1">
            Your ParkEase dashboard is being built. More features coming soon.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {[
            { label: 'Total Bookings', value: '0', icon: '📋', color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Spent',    value: '₹0', icon: '💰', color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-secondary-200 p-5 flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xl', stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-sm text-secondary-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mode Switcher info card */}
        <div className="bg-white rounded-2xl border border-secondary-200 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-secondary-900 mb-1">
                One account. Two modes.
              </h2>
              <p className="text-secondary-500 text-sm max-w-xl">
                Use the <span className="font-semibold text-secondary-700">Booking / Owner</span> mode switcher in the header
                to switch between finding parking and managing your parking spaces — all from the same account.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { phase: 'Phase 3', label: 'Email Verification' },
              { phase: 'Phase 4', label: 'Profile Management' },
              { phase: 'Phase 6', label: 'Owner Onboarding' },
              { phase: 'Phase 10', label: 'Parking Search' },
              { phase: 'Phase 13', label: 'Bookings' },
            ].map((item) => (
              <span
                key={item.phase}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-100 rounded-full text-xs text-secondary-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                {item.phase}: {item.label}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
