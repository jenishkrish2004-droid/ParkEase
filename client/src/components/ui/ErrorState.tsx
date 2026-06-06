// ============================================================
// ErrorState Component
// ============================================================
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ErrorStateType = 'generic' | 'network' | 'not-found' | 'forbidden' | 'server';

const errorConfigs: Record<
  ErrorStateType,
  { title: string; description: string; code?: string }
> = {
  generic:     { title: 'Something went wrong',      description: 'An unexpected error occurred. Please try again.' },
  network:     { title: 'Connection error',           description: 'Unable to connect to the server. Check your internet connection.' },
  'not-found': { title: 'Page not found',             description: 'The page you\'re looking for doesn\'t exist or has been moved.', code: '404' },
  forbidden:   { title: 'Access denied',              description: 'You don\'t have permission to view this page.', code: '403' },
  server:      { title: 'Server error',               description: 'Our servers are having issues. We\'re working to fix this.', code: '500' },
};

export interface ErrorStateProps {
  type?: ErrorStateType;
  title?: string;
  description?: string;
  error?: Error | null;
  onRetry?: () => void;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { wrapper: 'py-8',  icon: 'w-12 h-12', title: 'text-base', desc: 'text-sm'  },
  md: { wrapper: 'py-12', icon: 'w-16 h-16', title: 'text-xl',   desc: 'text-sm'  },
  lg: { wrapper: 'py-16', icon: 'w-20 h-20', title: 'text-2xl',  desc: 'text-base' },
};

function ErrorIllustration({ size }: { size: string }) {
  return (
    <div className={cn('relative flex items-center justify-center', size)}>
      <div className="absolute inset-0 bg-danger-50 rounded-2xl" />
      <svg
        className="relative w-1/2 h-1/2 text-danger-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    </div>
  );
}

export function ErrorState({
  type = 'generic',
  title,
  description,
  error,
  onRetry,
  action,
  size = 'md',
  className,
}: ErrorStateProps) {
  const config = errorConfigs[type];
  const displayTitle = title ?? config.title;
  const displayDescription = description ?? (error?.message || config.description);
  const sz = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        sz.wrapper,
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      {config.code && (
        <p className="text-5xl font-bold text-danger-100 mb-2 font-display">{config.code}</p>
      )}

      <ErrorIllustration size={sz.icon} />

      <h2 className={cn('mt-4 font-semibold text-secondary-900', sz.title)}>
        {displayTitle}
      </h2>

      <p className={cn('mt-2 text-secondary-500 max-w-sm', sz.desc)}>
        {displayDescription}
      </p>

      {/* Actions */}
      {(onRetry || action) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl',
                'bg-primary-600 text-white text-sm font-medium',
                'hover:bg-primary-700 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Try again
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
