import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function OwnerLayout() {
  const sections = [
    {
      title: 'Owner Dashboard',
      items: [
        { label: 'Overview', href: '/owner/dashboard', icon: '📊' },
        { label: 'My Listings', href: '/owner/listings', icon: '🅿️' },
        { label: 'Bookings', href: '/owner/bookings', icon: '📅' },
        { label: 'Earnings', href: '/owner/earnings', icon: '💰' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Owner Profile', href: '/profile', icon: '👤' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Render icons correctly in real app, these are strings for now */}
        <Sidebar sections={sections} className="hidden md:flex" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
