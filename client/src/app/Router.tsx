// ============================================================
// React Router Configuration
// ============================================================
// Routes are organized into public, public-only, and protected
// sections. New routes are added as phases are completed.
// ============================================================

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link, useRouteError } from 'react-router-dom';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/layout/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';
import { cn } from '@/lib/utils';

const LandingPage        = lazy(() => import('@/features/landing/LandingPage'));
const LoginPage          = lazy(() => import('@/features/auth/LoginPage'));
const RegisterPage       = lazy(() => import('@/features/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'));
const DashboardPage      = lazy(() => import('@/features/dashboard/DashboardPage'));
const SearchPage         = lazy(() => import('@/features/search/SearchPage'));
const ParkingDetailsPage = lazy(() => import('@/features/search/ParkingDetailsPage'));
const EVRoutePage        = lazy(() => import('@/features/search/EVRoutePage'));

// Phase 4 Lazy Imports
const SettingsPage       = lazy(() => import('@/features/settings/SettingsPage'));
const ProfilePage        = lazy(() => import('@/features/user/ProfilePage'));
const MyBookingsPage     = lazy(() => import('@/features/booking/MyBookingsPage'));
const MyVehiclesPage     = lazy(() => import('@/features/vehicle/MyVehiclesPage'));
const VerificationPage   = lazy(() => import('@/features/verification/VerificationPage').then(module => ({ default: module.VerificationPage })));

const OwnerOnboarding    = lazy(() => import('@/features/owner/OwnerOnboarding'));
const OwnerDashboard     = lazy(() => import('@/features/owner/OwnerDashboard'));
const OwnerListings      = lazy(() => import('@/features/owner/OwnerListings'));
const CreateListingForm  = lazy(() => import('@/features/owner/CreateListingForm'));
const EVPartnershipForm  = lazy(() => import('@/features/owner/EVPartnershipForm'));
import { OwnerLayout }     from '@/components/layout/OwnerLayout';

// Phase 4: Under Development Page
const UnderDevelopmentPage = lazy(() => import('@/features/misc/UnderDevelopmentPage'));

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

function OwnerIndexRedirect() {
  const { user } = useAuth();
  if (!user?.isOwner || !user?.ownerVerified) {
    return <Navigate to="/owner/onboarding" replace />;
  }
  return <Navigate to="/owner/dashboard" replace />;
}

// ── Fallback Spinner ─────────────────────────────────────────
function PageLoader() {
  return <FullPageSpinner />;
}

// ── 404 Not Found ────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <p className="text-8xl font-bold text-secondary-100 font-display select-none" aria-hidden="true">404</p>
      <div className="mt-2 w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </div>
      <h1 className="mt-5 text-2xl font-bold text-secondary-900">Page not found</h1>
      <p className="mt-2 text-secondary-500 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/" className={cn('px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors no-underline')}>
          Back to Home
        </Link>
        <Link to="/" className={cn('px-5 py-2.5 rounded-xl text-sm font-medium border border-secondary-300 text-secondary-700 hover:bg-secondary-50 transition-colors no-underline')}>
          Find Parking
        </Link>
      </div>
    </div>
  );
}

// ── Unauthorized Page ─────────────────────────────────────────
function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="w-16 h-16 bg-danger-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-danger-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-secondary-900">Access Denied</h1>
      <p className="mt-2 text-secondary-500 max-w-sm">
        You don't have permission to view this page.
      </p>
      <Link to="/dashboard" className={cn('mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors no-underline')}>
        Go to Dashboard
      </Link>
    </div>
  );
}

// ── Global Error Boundary ────────────────────────────────────
function GlobalErrorBoundary() {
  const error = useRouteError() as any;
  console.error('Router Error Boundary caught:', error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#110e07] px-4 text-center">
      <div className="w-20 h-20 bg-danger-50 dark:bg-danger-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-danger-100 dark:border-danger-500/20">
        <span className="material-symbols-outlined text-[40px] text-danger-500">error</span>
      </div>
      <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-[#eae1d4]">
        Oops! Something went wrong.
      </h1>
      <p className="mt-4 text-secondary-600 dark:text-[#d0c5af] max-w-md">
        {error?.statusText || error?.message || "An unexpected application error occurred."}
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <Link to="/" className="px-6 py-3 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 dark:bg-[#f2ca50] dark:text-[#3c2f00] dark:hover:bg-[#fceb96] transition-colors no-underline shadow-md">
          Return Home
        </Link>
        <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl text-sm font-semibold border border-secondary-300 text-secondary-700 dark:border-[#4d4635] dark:text-[#eae1d4] hover:bg-secondary-50 dark:hover:bg-white/5 transition-colors shadow-sm">
          Try Again
        </button>
      </div>
    </div>
  );
}

// ── Layout Wrapper ────────────────────────────────────────────
function RootLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

// ── Router ────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      // ── Public Routes ──────────────────────────────────────
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'parking/:id',
        element: <ParkingDetailsPage />,
      },
      {
        path: 'ev-route',
        element: <EVRoutePage />,
      },

      // ── Public-Only Routes (redirect if logged in) ─────────
      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        ),
      },

      // ── Protected Routes ───────────────────────────────────
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <PageLayout showFooter={false}>
              <DashboardPage />
            </PageLayout>
          </ProtectedRoute>
        ),
      },

      // Utility pages
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },

      // Phase 4: Shared Routes
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'verification',
        element: (
          <ProtectedRoute>
            <VerificationPage />
          </ProtectedRoute>
        ),
      },

      // Phase 4: Booking Mode Routes
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'vehicles',
        element: (
          <ProtectedRoute>
            <MyVehiclesPage />
          </ProtectedRoute>
        ),
      },

      // Phase 4: Owner Mode Routes
      {
        path: 'owner/onboarding',
        element: (
          <ProtectedRoute>
            <OwnerOnboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: 'owner',
        element: (
          <ProtectedRoute>
            <OwnerLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <OwnerIndexRedirect /> },
          { path: 'dashboard', element: <OwnerDashboard /> },
          { path: 'ev-partnership', element: <EVPartnershipForm /> },
          { path: 'listings', element: <OwnerListings /> },
          { path: 'listings/new', element: <CreateListingForm /> },
          { path: 'reports', element: <UnderDevelopmentPage /> },
        ],
      },

      // ── Under Development Routes ──
      ...[
        'about',
        'blog',
        'careers',
        'press',
        'help',
        'contact',
        'safety',
        'pricing',
        'privacy',
        'terms',
        'cookies',
        'sitemap',
        'mobile-app',
        'accessibility',
        'vehicles/new',
      ].map((path) => ({
        path,
        element: <UnderDevelopmentPage />,
      })),

      // Future Phases...
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
