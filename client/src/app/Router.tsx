// ============================================================
// React Router Configuration
// ============================================================
// All application routes are defined here.
// Routes are added progressively as phases are completed.
// ============================================================

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// Placeholder pages — will be replaced by feature-specific pages
function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-secondary-200">
        <div className="container-app flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-display font-bold text-heading-md text-secondary-900">
              ParkEase
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-body-sm text-secondary-600 hover:text-secondary-900 transition-colors">
              Find Parking
            </a>
            <a href="#" className="text-body-sm text-secondary-600 hover:text-secondary-900 transition-colors">
              List Your Space
            </a>
            <a href="#" className="text-body-sm text-secondary-600 hover:text-secondary-900 transition-colors">
              Help
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-body-sm text-secondary-700 hover:text-secondary-900 font-medium transition-colors">
              Log in
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white text-body-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container-app py-20 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="text-display-lg text-secondary-900 text-balance">
            Find & Book Parking
            <span className="text-primary-600"> Instantly</span>
          </h1>
          <p className="mt-6 text-body-lg text-secondary-500 max-w-2xl">
            Discover verified parking spots near you. Book in seconds, pay securely, 
            and never circle the block again.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by location, landmark, or address..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-secondary-300 text-body-md placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              />
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm hover:shadow-md">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-secondary-100 bg-secondary-50">
        <div className="container-app py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Parking Spots' },
              { value: '50,000+', label: 'Happy Users' },
              { value: '100+', label: 'Cities' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-display-sm text-primary-600">{stat.value}</div>
                <div className="mt-1 text-body-sm text-secondary-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white">
        <div className="container-app py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-display font-semibold text-secondary-700">ParkEase</span>
            </div>
            <p className="text-body-sm text-secondary-400">
              © {new Date().getFullYear()} ParkEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center animate-fade-in">
        <h1 className="text-display-lg text-secondary-900">404</h1>
        <p className="mt-2 text-body-lg text-secondary-500">Page not found</p>
        <a
          href="/"
          className="mt-6 inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Go Home
        </a>
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
        element: <HomePage />,
      },
      // Phase 2: Auth pages
      // { path: 'login', element: <LoginPage /> },
      // { path: 'register', element: <RegisterPage /> },

      // Phase 4: Profile
      // { path: 'profile', element: <ProfilePage /> },

      // Phase 10: Parking Discovery
      // { path: 'search', element: <SearchPage /> },
      // { path: 'parking/:id', element: <ParkingDetailPage /> },

      // Phase 13: Bookings
      // { path: 'bookings', element: <BookingsPage /> },
      // { path: 'bookings/:id', element: <BookingDetailPage /> },

      // Phase 18: Owner Dashboard
      // { path: 'owner/*', element: <OwnerLayout /> },

      // Phase 20: Admin Dashboard
      // { path: 'admin/*', element: <AdminLayout /> },
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
