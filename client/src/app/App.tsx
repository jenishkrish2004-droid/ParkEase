// ============================================================
// Root Application Component
// ============================================================

import { QueryProvider, AuthProvider } from './providers';
import { AppRouter } from './Router';
import { Toaster } from '@/components/ui/Toast';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  );
}
