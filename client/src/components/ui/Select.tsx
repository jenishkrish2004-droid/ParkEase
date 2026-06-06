// ============================================================
// Select Component
// ============================================================
import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
  leftElement?: ReactNode;
  selectSize?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-8  pl-3 text-sm',
  md: 'h-10 pl-4 text-sm',
  lg: 'h-12 pl-4 text-base',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options = [],
      placeholder,
      leftElement,
      selectSize = 'md',
      className,
      id,
      required,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-secondary-700">
            {label}
            {required && (
              <span className="ml-1 text-danger-500" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <span className="absolute left-3 flex items-center text-secondary-400 pointer-events-none z-10">
              {leftElement}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            className={cn(
              // Base
              'w-full appearance-none rounded-xl border bg-white transition-all duration-200',
              'text-secondary-900 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Chevron space
              'pr-10',
              // Size
              sizeStyles[selectSize],
              leftElement && 'pl-10',
              // State: normal
              !hasError && !disabled &&
                'border-secondary-300 focus:border-primary-500 focus:ring-primary-500/20',
              // State: error
              hasError &&
                'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20 bg-danger-50',
              // State: disabled
              disabled &&
                'bg-secondary-50 border-secondary-200 text-secondary-400 cursor-not-allowed',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children ??
              options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
          </select>

          {/* Chevron Icon */}
          <span className="absolute right-3 flex items-center pointer-events-none text-secondary-400">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {hasError ? (
          <p id={`${selectId}-error`} role="alert" className="text-xs text-danger-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="text-xs text-secondary-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
