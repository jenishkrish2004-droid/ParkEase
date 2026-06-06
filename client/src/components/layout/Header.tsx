// ============================================================
// Header Layout Component
// ============================================================
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Find Parking',    href: '/search' },
  { label: 'List Your Space', href: '/owner'  },
  { label: 'How It Works',    href: '/#how-it-works' },
];

export interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

export function Header({ transparent = false, className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isHome = location.pathname === '/';

  const headerBg =
    transparent && isHome && !scrolled
      ? 'bg-transparent'
      : 'bg-white/95 backdrop-blur-sm border-b border-secondary-200';

  return (
    <header
      className={cn(
        'sticky top-0 z-[100] transition-all duration-300',
        headerBg,
        className,
      )}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group no-underline"
            aria-label="ParkEase — Go to homepage"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <ParkEaseLogo />
            </div>
            <span className="font-display font-bold text-lg text-secondary-900 tracking-tight">
              ParkEase
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline',
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Auth Buttons ── */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg',
                'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100',
                'transition-colors no-underline',
              )}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-xl',
                'bg-primary-600 text-white hover:bg-primary-700',
                'transition-colors shadow-sm hover:shadow-md no-underline',
              )}
            >
              Sign up free
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'md:hidden flex items-center justify-center w-9 h-9 rounded-lg',
              'text-secondary-600 hover:bg-secondary-100 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            )}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white animate-slide-down">
          <div className="container-app py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-colors no-underline',
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-700 hover:bg-secondary-50',
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-secondary-100 mt-3 pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                className="px-4 py-3 rounded-xl text-sm font-medium text-center text-secondary-700 border border-secondary-300 hover:bg-secondary-50 transition-colors no-underline"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-3 rounded-xl text-sm font-semibold text-center text-white bg-primary-600 hover:bg-primary-700 transition-colors no-underline"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ── ParkEase Logo ────────────────────────────────────────────
function ParkEaseLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 3h5c1.657 0 3 1.343 3 3s-1.343 3-3 3H6v4H4V3z" fill="white" />
      <path d="M6 7h3a1 1 0 000-2H6v2z" fill="#BFDBFE" />
    </svg>
  );
}
