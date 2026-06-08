// ============================================================
// Root Application Component
// ============================================================

import { QueryProvider, AuthProvider, ThemeProvider } from './providers';
import { AppRouter } from './Router';
import { Toaster } from '@/components/ui/Toast';

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
