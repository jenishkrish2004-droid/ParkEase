// ============================================================
// MobileNav — Bottom Navigation for Mobile
// ============================================================
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface MobileNavItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
  exact?: boolean;
}

export interface MobileNavProps {
  items: MobileNavItem[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        'fixed bottom-0 inset-x-0 z-[100] md:hidden',
        'bg-white/95 backdrop-blur-sm border-t border-secondary-200',
        'pb-safe',
        className,
      )}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 no-underline',
                'transition-colors duration-150 min-w-0',
                isActive ? 'text-primary-600' : 'text-secondary-500',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="w-6 h-6 shrink-0">{item.icon(isActive)}</span>
              <span
                className={cn(
                  'text-[10px] font-medium leading-none truncate',
                  isActive ? 'text-primary-600' : 'text-secondary-500',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ── Default ParkEase Mobile Nav ─────────────────────────────
export function ParkEaseMobileNav() {
  const items: MobileNavItem[] = [
    {
      label: 'Home',
      href: '/',
      exact: true,
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Search',
      href: '/search',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      label: 'Bookings',
      href: '/bookings',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return <MobileNav items={items} />;
}
