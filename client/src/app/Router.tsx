// ============================================================
// React Router Configuration
// ============================================================
// All application routes are defined here.
// Routes are added progressively as phases are completed.
// ============================================================

import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import LandingPage from '@/features/landing/LandingPage';
import { cn } from '@/lib/utils';

// ── 404 Not Found ────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="animate-fade-in">
        <p className="text-8xl font-bold text-secondary-100 font-display select-none" aria-hidden="true">404</p>
        <div className="mt-2 w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-bold text-secondary-900">Parking spot not found</h1>
        <p className="mt-2 text-secondary-500 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-semibold',
              'bg-primary-600 text-white hover:bg-primary-700',
              'transition-colors shadow-sm no-underline',
            )}
          >
            Back to Home
          </Link>
          <Link
            to="/search"
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-medium',
              'border border-secondary-300 text-secondary-700 hover:bg-secondary-50',
              'transition-colors no-underline',
            )}
          >
            Find Parking
          </Link>
        </div>
      </div>
    </div>
  );
}

// Layout wrapper for future nested routing
function RootLayout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      // Phase 2: Auth pages
      // { path: 'login',    element: <LoginPage />    },
      // { path: 'register', element: <RegisterPage /> },

      // Phase 4: Profile
      // { path: 'profile',  element: <ProfilePage />  },

      // Phase 10: Parking Discovery
      // { path: 'search',          element: <SearchPage />        },
      // { path: 'parking/:id',     element: <ParkingDetailPage /> },

      // Phase 13: Bookings
      // { path: 'bookings',     element: <BookingsPage />       },
      // { path: 'bookings/:id', element: <BookingDetailPage />  },

      // Phase 18: Owner Dashboard
      // { path: 'owner/*',  element: <OwnerLayout />  },

      // Phase 20: Admin Dashboard
      // { path: 'admin/*',  element: <AdminLayout />  },
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
