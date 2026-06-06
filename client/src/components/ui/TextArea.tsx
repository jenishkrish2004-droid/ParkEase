// ============================================================
// TextArea Component
// ============================================================
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
  resize?: 'none' | 'y' | 'x' | 'both';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      showCount = false,
      maxLength,
      resize = 'y',
      className,
      id,
      required,
      disabled,
      value,
      ...props
    },
    ref,
  ) => {
    const textareaId = id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(error);
    const charCount = typeof value === 'string' ? value.length : 0;

    const resizeClass = {
      none: 'resize-none',
      y:    'resize-y',
      x:    'resize-x',
      both: 'resize',
    }[resize];

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label row */}
        {label && (
          <div className="flex justify-between items-center">
            <label
              htmlFor={textareaId}
              className="text-sm font-medium text-secondary-700"
            >
              {label}
              {required && (
                <span className="ml-1 text-danger-500" aria-hidden="true">*</span>
              )}
            </label>
            {showCount && maxLength && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  charCount >= maxLength ? 'text-danger-500' : 'text-secondary-400',
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          required={required}
          className={cn(
            // Base
            'w-full min-h-[100px] rounded-xl border bg-white px-4 py-3',
            'text-sm text-secondary-900 placeholder:text-secondary-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            resizeClass,
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

        {/* Helper / Error */}
        {hasError ? (
          <p id={`${textareaId}-error`} role="alert" className="text-xs text-danger-600 flex items-center gap-1">
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
          <p id={`${textareaId}-helper`} className="text-xs text-secondary-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
