// ============================================================
// Header Layout Component
// ============================================================
// Auth-aware: shows user avatar/mode-switcher when logged in,
// Sign In / Create Account buttons when logged out.
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/providers/AuthProvider';
import { Avatar } from '@/components/ui/Avatar';
import { useLogout } from '@/features/auth/hooks/useAuthMutations';
import { useParkEaseMode, commitModeSync, type ParkEaseMode } from '@/app/providers/useParkEaseMode';
import { useTheme } from '@/app/providers/ThemeProvider';

// ── Nav items (unauthenticated view only) ────────────────────
const NAV_ITEMS: { label: string; href: string }[] = [];

export interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

export function Header({ transparent = false, className }: HeaderProps) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location  = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
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
        'dark:bg-[#110e07]/95 dark:border-[#4d4635]',
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
            <span className="font-display font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-[#fceb96] dark:to-[#d4af37]">
              ParkEase
            </span>
          </Link>

          {/* ── Center: Mode Switcher (Auth) or Nav (Unauth) ── */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {isAuthenticated && user ? (
              <ModeSwitcher user={user} />
            ) : (
              <nav className="flex items-center gap-1" aria-label="Main navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline',
                      location.pathname === item.href
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/30 dark:text-primary-400'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-secondary-100 dark:hover:bg-secondary-800',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* ── Right Side: Auth-Aware ── */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoading ? (
              /* Skeleton to prevent layout shift */
              <div className="flex items-center gap-3">
                <div className="w-20 h-8 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
                <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-800 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated && user ? (
              <AuthenticatedNav user={user} />
            ) : (
              <UnauthenticatedNav />
            )}
          </div>

          {/* ── Mobile Toggle ── */}
            <ThemeToggle className="md:hidden mr-2" />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'md:hidden flex items-center justify-center w-9 h-9 rounded-lg',
              'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800 transition-colors',
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
            <MobileAuthSection />
          </div>
        </div>
      )}
    </header>
  );
}

// ── Unauthenticated nav buttons ───────────────────────────────
function UnauthenticatedNav() {
  return (
    <>
      <Link
        to="/login"
        className={cn(
          'px-3 py-2 text-sm font-medium rounded-lg',
          'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100',
          'transition-colors no-underline',
        )}
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className={cn(
          'px-4 py-2 text-sm font-semibold rounded-xl',
          'bg-primary-600 text-white hover:bg-primary-700',
          'transition-colors shadow-sm hover:shadow-md no-underline',
        )}
      >
        Create Account
      </Link>
    </>
  );
}

// ── Authenticated nav: mode switcher + user menu ─────────────
function AuthenticatedNav({ user }: { user: { firstName: string; lastName: string; email: string; avatar: string | null; isOwner: boolean; ownerVerified: boolean; verificationStatus: string } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="flex items-center gap-3">
      {/* User Menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Open user menu"
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-xl border border-transparent transition-all duration-150',
            menuOpen
              ? 'bg-secondary-100 dark:bg-[#f2ca50]/15 dark:backdrop-blur-md dark:border-[#f2ca50]/30 dark:shadow-[0_0_15px_rgba(242,202,80,0.15)]'
              : 'hover:bg-secondary-100 dark:hover:bg-black/40 dark:hover:border-[#4d4635]/50 dark:hover:backdrop-blur-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          )}
        >
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            src={user.avatar ?? undefined}
            size="sm"
          />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-secondary-900 dark:text-[#eae1d4] leading-none">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-secondary-500 dark:text-[#d0c5af] mt-0.5 truncate max-w-[120px]">{user.email}</p>
          </div>
          <svg className="w-3.5 h-3.5 text-secondary-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className={cn(
            'absolute right-0 top-full mt-2 w-56',
            'bg-white dark:bg-[#110e07] dark:surface-glass rounded-2xl border border-secondary-200 dark:border-[#4d4635] shadow-elevated',
            'py-1 z-50 animate-fade-in',
          )}>
            {/* User info */}
            <div className="px-4 py-3 border-b border-secondary-100 dark:border-[#4d4635]/50">
              <p className="text-sm font-semibold text-secondary-900 dark:text-[#eae1d4]">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-secondary-500 dark:text-[#d0c5af] truncate mt-0.5">{user.email}</p>
              <div className="mt-2 flex items-center">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                  user.verificationStatus === 'APPROVED' ? "bg-success-100 text-success-700 dark:bg-[#f2ca50]/20 dark:text-[#f2ca50]" :
                  user.verificationStatus === 'PENDING' ? "bg-warning-100 text-warning-700" :
                  "bg-secondary-100 text-secondary-700 dark:bg-white/10 dark:text-white/60"
                )}>
                  {user.verificationStatus === 'APPROVED' ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
            {/* Menu items */}
            <div className="py-1">
              <HeaderDropdownLinks setMenuOpen={setMenuOpen} />
            </div>
            <div className="border-t border-secondary-100 dark:border-[#4d4635]/50 py-1">
              <button
                type="button"
                onClick={() => { logoutMutation.mutate(); setMenuOpen(false); }}
                disabled={logoutMutation.isPending}
                className="w-full text-left px-4 py-2.5 text-sm text-danger-600 dark:text-[#ffb4ab] hover:bg-danger-50 dark:hover:bg-[#ffb4ab]/10 transition-colors flex items-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {logoutMutation.isPending ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mode-Specific Dropdown Links ─────────────────────────────
function HeaderDropdownLinks({ setMenuOpen }: { setMenuOpen: (v: boolean) => void }) {
  const [mode] = useParkEaseMode();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const navItemClass = "w-full text-left px-4 py-2.5 text-sm text-secondary-700 dark:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-[#f2ca50]/10 transition-colors flex items-center gap-2.5";

  if (mode === 'owner') {
    return (
      <>
        <button type="button" onClick={() => handleNav('/owner/dashboard')} className={navItemClass}>
          Owner Dashboard
        </button>
        <button type="button" onClick={() => handleNav('/owner/onboarding')} className={navItemClass}>
          Owner Onboarding
        </button>
        <button type="button" onClick={() => handleNav('/owner/listings')} className={navItemClass}>
          My Listings
        </button>
        <button type="button" onClick={() => handleNav('/owner/bookings')} className={navItemClass}>
          Owner Bookings
        </button>
        <button type="button" onClick={() => handleNav('/owner/earnings')} className={navItemClass}>
          Earnings
        </button>
        <div className="my-1 border-t border-secondary-100 dark:border-[#4d4635]/50" />
        <button type="button" onClick={() => handleNav('/profile')} className={navItemClass}>
          Profile
        </button>
        <button type="button" onClick={() => handleNav('/verification')} className={navItemClass}>
          Owner Verification
        </button>
      </>
    );
  }

  return (
    <>
      <button type="button" onClick={() => handleNav('/dashboard')} className={navItemClass}>
        Dashboard
      </button>
      <button type="button" onClick={() => handleNav('/bookings')} className={navItemClass}>
        My Bookings
      </button>
      <button type="button" onClick={() => handleNav('/payments')} className={navItemClass}>
        Payments
      </button>
      <button type="button" onClick={() => handleNav('/vehicles')} className={navItemClass}>
        My Vehicles
      </button>
      <button type="button" onClick={() => handleNav('/reviews')} className={navItemClass}>
        My Reviews
      </button>
      <div className="my-1 border-t border-secondary-100 dark:border-[#4d4635]/50" />
      <button type="button" onClick={() => handleNav('/profile')} className={navItemClass}>
        Profile
      </button>
      <button type="button" onClick={() => handleNav('/verification')} className={navItemClass}>
        Verification
      </button>
    </>
  );
}

// ── Mode Switcher ────────────────────────────────────────────

function ModeSwitcher({ user }: { user: { isOwner: boolean; ownerVerified: boolean } }) {
  const navigate = useNavigate();
  const [mode] = useParkEaseMode();

  function handleModeSwitch(next: ParkEaseMode) {
    if (next === mode) return; // already in this mode, nothing to do

    // Flush the mode commit synchronously BEFORE navigation so that
    // every component at the destination sees the correct mode on its
    // very first render — eliminating the stale-state routing bug.
    flushSync(() => {
      commitModeSync(next);
    });

    if (next === 'owner') {
      navigate('/owner/dashboard');
    } else {
      // Booking mode: go to the landing page (search bar is in the hero section)
      navigate('/');
    }
  }

  const activeMode = mode;

  return (
    <div
      className="flex items-center bg-secondary-100 dark:bg-black/40 dark:backdrop-blur-md border border-transparent dark:border-[#4d4635]/50 rounded-xl p-0.5 gap-0.5"
      role="group"
      aria-label="Switch between Booking and Owner mode"
    >
      <button
        type="button"
        onClick={() => handleModeSwitch('booking')}
        aria-pressed={activeMode === 'booking'}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
          activeMode === 'booking'
            ? 'bg-white dark:bg-transparent text-primary-600 shadow-sm dark:bg-[#f2ca50]/15 dark:backdrop-blur-md dark:text-[#fceb96] dark:shadow-[0_0_15px_rgba(242,202,80,0.2)] dark:border dark:border-[#f2ca50]/30'
            : 'text-secondary-500 hover:text-secondary-700 dark:text-[#eae1d4]/70 dark:hover:text-[#eae1d4]',
        )}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        Find Parking
      </button>
      <button
        type="button"
        onClick={() => handleModeSwitch('owner')}
        aria-pressed={activeMode === 'owner'}
        title={!user.isOwner || !user.ownerVerified ? 'Set up your owner profile to access this mode' : undefined}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
          activeMode === 'owner'
            ? 'bg-white dark:bg-transparent text-amber-600 shadow-sm dark:bg-[#f2ca50]/15 dark:backdrop-blur-md dark:text-[#fceb96] dark:shadow-[0_0_15px_rgba(242,202,80,0.2)] dark:border dark:border-[#f2ca50]/30'
            : 'text-secondary-500 hover:text-secondary-700 dark:text-[#eae1d4]/70 dark:hover:text-[#eae1d4]',
        )}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
        List your Space
      </button>
    </div>
  );
}

// ── Mobile auth section (inside hamburger menu) ───────────────
function MobileAuthSection() {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();

  if (!isAuthenticated || !user) {
    return (
      <div className="border-t border-secondary-100 mt-3 pt-3 flex flex-col gap-2">
        <Link
          to="/login"
          className="px-4 py-3 rounded-xl text-sm font-medium text-center text-secondary-700 border border-secondary-300 hover:bg-secondary-50 transition-colors no-underline"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-3 rounded-xl text-sm font-semibold text-center text-white bg-primary-600 hover:bg-primary-700 transition-colors no-underline"
        >
          Create Account
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-secondary-100 mt-3 pt-3">
      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-2 mb-2">
        <Avatar firstName={user.firstName} lastName={user.lastName} src={user.avatar ?? undefined} size="sm" />
        <div>
          <p className="text-sm font-semibold text-secondary-900">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-secondary-500 truncate">{user.email}</p>
        </div>
      </div>
      
      {/* Mobile Links */}
      <MobileHeaderLinks />

      <button
        type="button"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-danger-600 hover:bg-danger-50 transition-colors disabled:opacity-50"
      >
        {logoutMutation.isPending ? 'Signing out…' : 'Sign Out'}
      </button>
    </div>
  );
}

function MobileHeaderLinks() {
  const [mode] = useParkEaseMode();
  const linkClass = "block px-4 py-2.5 rounded-xl text-sm text-secondary-700 hover:bg-secondary-50 transition-colors no-underline";

  if (mode === 'owner') {
    return (
      <>
        <Link to="/owner/dashboard" className={linkClass}>Owner Dashboard</Link>
        <Link to="/owner/onboarding" className={linkClass}>Owner Onboarding</Link>
        <Link to="/owner/listings" className={linkClass}>My Listings</Link>
        <Link to="/owner/bookings" className={linkClass}>Owner Bookings</Link>
        <Link to="/owner/earnings" className={linkClass}>Earnings</Link>
        <Link to="/profile" className={linkClass}>Profile</Link>
        <Link to="/verification" className={linkClass}>Owner Verification</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/dashboard" className={linkClass}>Dashboard</Link>
      <Link to="/bookings" className={linkClass}>My Bookings</Link>
      <Link to="/payments" className={linkClass}>Payments</Link>
      <Link to="/vehicles" className={linkClass}>My Vehicles</Link>
      <Link to="/reviews" className={linkClass}>My Reviews</Link>
      <Link to="/profile" className={linkClass}>Profile</Link>
      <Link to="/verification" className={linkClass}>Verification</Link>
    </>
  );
}

// ── ParkEase Logo Mark (location pin with P) ─────────────────
function ParkEaseLogo({ size = 30 }: { size?: number }) {
  const w = Math.round(size * 0.8);
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 24 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pin body */}
      <path
        d="M12 0C5.925 0 1 4.925 1 11C1 18.5 12 30 12 30C12 30 23 18.5 23 11C23 4.925 18.075 0 12 0Z"
        fill="#f2ca50"
      />
      {/* P — vertical stem */}
      <rect x="7" y="5.5" width="2.5" height="13" rx="0.5" fill="white" />
      {/* P — outer bowl */}
      <path d="M9.5 5.5H13C16.5 5.5 16.5 12.5 13 12.5H9.5V5.5Z" fill="white" />
      {/* P — inner counter (blue cutout to make the loop visible) */}
      <path d="M10 7H13C14.5 7 14.5 11 13 11H10V7Z" fill="#f2ca50" />
    </svg>
  );
}

// ── Theme Toggle Component ─────────────────────────────────────
function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-xl transition-colors',
        'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900',
        'dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100',
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span className="material-symbols-outlined text-[20px]">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
      )}
    </button>
  );
}

