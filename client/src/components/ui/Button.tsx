// ============================================================
// Button Component
// ============================================================
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md disabled:bg-primary-300',
  secondary:
    'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 disabled:bg-secondary-50 disabled:text-secondary-400',
  outline:
    'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400 active:bg-secondary-100 disabled:border-secondary-200 disabled:text-secondary-400',
  ghost:
    'bg-transparent text-secondary-700 hover:bg-secondary-100 active:bg-secondary-200 disabled:text-secondary-400',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-sm hover:shadow-md disabled:bg-danger-300',
  link:
    'bg-transparent text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline disabled:text-secondary-400 p-0 h-auto',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-3 text-xs rounded-md gap-1',
  sm: 'h-8 px-3.5 text-sm rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-11 px-5 text-base rounded-xl gap-2',
  xl: 'h-13 px-7 text-base rounded-2xl gap-2.5',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'select-none cursor-pointer',
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="ml-1">{children ?? 'Loading...'}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
