// ============================================================
// Checkbox Component
// ============================================================
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { box: 'w-3.5 h-3.5 rounded', label: 'text-sm', desc: 'text-xs' },
  md: { box: 'w-4 h-4 rounded',     label: 'text-sm', desc: 'text-xs' },
  lg: { box: 'w-5 h-5 rounded-md',  label: 'text-base', desc: 'text-sm' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, size = 'md', className, id, disabled, ...props }, ref) => {
    const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(error);
    const sz = sizeStyles[size];

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex items-start gap-2.5 cursor-pointer group',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          {/* Checkbox Input */}
          <div className="relative flex shrink-0 items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              aria-invalid={hasError}
              {...props}
              className={cn(
                'peer appearance-none border-2 transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                sz.box,
                !hasError
                  ? 'border-secondary-300 group-hover:border-primary-400 checked:border-primary-600 checked:bg-primary-600'
                  : 'border-danger-500 checked:border-danger-600 checked:bg-danger-600',
                disabled && 'cursor-not-allowed',
              )}
            />
            {/* Check icon overlay */}
            <svg
              className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-150"
              viewBox="0 0 12 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 5l3.5 3.5L11 1" />
            </svg>
          </div>

          {/* Label Content */}
          {(label || description) && (
            <div className="flex flex-col gap-0.5 min-w-0">
              {label && (
                <span className={cn('font-medium text-secondary-900', sz.label)}>
                  {label}
                </span>
              )}
              {description && (
                <span className={cn('text-secondary-500', sz.desc)}>{description}</span>
              )}
            </div>
          )}
        </label>

        {hasError && (
          <p role="alert" className="text-xs text-danger-600 flex items-center gap-1 pl-6">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
