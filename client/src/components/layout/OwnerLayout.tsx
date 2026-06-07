import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function OwnerLayout() {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
