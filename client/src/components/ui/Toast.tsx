// ============================================================
// Toast Component (wraps react-hot-toast with design system)
// ============================================================
import toast, { Toaster as HotToaster, type ToastOptions } from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ── Toaster Config ───────────────────────────────────────────
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        className: cn(
          '!bg-white !text-secondary-900',
          '!shadow-elevated !rounded-xl !border !border-secondary-200',
          '!font-sans !text-sm',
          '!max-w-sm',
          '!p-0',
        ),
        success: {
          iconTheme: {
            primary: '#16A34A',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
          duration: 5000,
        },
      }}
    />
  );
}

// ── Toast Utilities ──────────────────────────────────────────
export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, options),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, options),

  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, options),

  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      icon: '💡',
      ...options,
    }),

  warning: (message: string, options?: ToastOptions) =>
    toast(message, {
      icon: '⚠️',
      ...options,
    }),

  dismiss: toast.dismiss,

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
    options?: ToastOptions,
  ) =>
    toast.promise(promise, messages, options),
};

export { toast };
