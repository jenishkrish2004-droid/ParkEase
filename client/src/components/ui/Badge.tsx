// ============================================================
// Badge Component
// ============================================================
import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

export type BadgeSize = 'xs' | 'sm' | 'md';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-secondary-100 text-secondary-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger:  'bg-danger-100 text-danger-700',
  info:    'bg-blue-100 text-blue-700',
  outline: 'bg-transparent border border-secondary-300 text-secondary-600',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1',
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  leftIcon?: ReactNode;
  rounded?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  leftIcon,
  rounded = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium transition-colors',
        rounded ? 'rounded-full' : 'rounded-md',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'danger'  && 'bg-danger-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'info'    && 'bg-blue-500',
            variant === 'default' && 'bg-secondary-400',
            variant === 'outline' && 'bg-secondary-400',
          )}
          aria-hidden="true"
        />
      )}
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
    </span>
  );
}

// ── StatusBadge ─────────────────────────────────────────────
// Convenience for booking/parking status labels
export type StatusBadgeStatus =
  | 'available'
  | 'occupied'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'active'
  | 'inactive';

const statusConfig: Record<StatusBadgeStatus, { variant: BadgeVariant; label: string }> = {
  available:  { variant: 'success', label: 'Available' },
  occupied:   { variant: 'danger',  label: 'Occupied'  },
  pending:    { variant: 'warning', label: 'Pending'   },
  confirmed:  { variant: 'primary', label: 'Confirmed' },
  cancelled:  { variant: 'danger',  label: 'Cancelled' },
  completed:  { variant: 'default', label: 'Completed' },
  active:     { variant: 'success', label: 'Active'    },
  inactive:   { variant: 'default', label: 'Inactive'  },
};

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  size?: BadgeSize;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'sm', showDot = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={showDot}
      rounded
      className={className}
    >
      {config.label}
    </Badge>
  );
}
