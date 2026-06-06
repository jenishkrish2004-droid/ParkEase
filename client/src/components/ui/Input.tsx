// ============================================================
// Input Component
// ============================================================
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm:  'h-8  px-3 text-sm',
  md:  'h-10 px-4 text-sm',
  lg:  'h-12 px-4 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftElement,
      rightElement,
      inputSize = 'md',
      className,
      id,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-secondary-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger-500" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Element */}
          {leftElement && (
            <span className="absolute left-3 flex items-center text-secondary-400 pointer-events-none z-10">
              {leftElement}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            required={required}
            className={cn(
              // Base
              'w-full rounded-xl border bg-white transition-all duration-200',
              'placeholder:text-secondary-400 text-secondary-900',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Size
              sizeStyles[inputSize],
              // Left/Right padding adjustments
              leftElement && 'pl-10',
              rightElement && 'pr-10',
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
          />

          {/* Right Element */}
          {rightElement && (
            <span className="absolute right-3 flex items-center text-secondary-400 z-10">
              {rightElement}
            </span>
          )}
        </div>

        {/* Helper / Error */}
        {hasError ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-danger-600 flex items-center gap-1"
          >
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
          <p id={`${inputId}-helper`} className="text-xs text-secondary-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
