// ============================================================
// Spinner Component
// ============================================================
import { cn } from '@/lib/utils';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'success' | 'danger';

const sizeStyles: Record<SpinnerSize, string> = {
  xs:  'w-3 h-3 border',
  sm:  'w-4 h-4 border-2',
  md:  'w-6 h-6 border-2',
  lg:  'w-8 h-8 border-[3px]',
  xl:  'w-12 h-12 border-4',
};

const colorStyles: Record<SpinnerVariant, string> = {
  primary:   'border-primary-200 border-t-primary-600',
  secondary: 'border-secondary-200 border-t-secondary-600',
  white:     'border-white/30 border-t-white',
  success:   'border-success-200 border-t-success-600',
  danger:    'border-danger-200 border-t-danger-600',
};

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className,
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeStyles[size],
          colorStyles[variant],
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

// ── FullPageSpinner ──────────────────────────────────────────
export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <Spinner size="lg" />
      <p className="text-sm text-secondary-500">{label}</p>
    </div>
  );
}

// ── InlineSpinner ────────────────────────────────────────────
export function InlineSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-secondary-500">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
