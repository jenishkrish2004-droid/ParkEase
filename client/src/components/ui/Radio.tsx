// ============================================================
// Radio Component
// ============================================================
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { box: 'w-3.5 h-3.5', dot: 'w-1.5 h-1.5', label: 'text-sm', desc: 'text-xs' },
  md: { box: 'w-4 h-4',     dot: 'w-2 h-2',     label: 'text-sm', desc: 'text-xs' },
  lg: { box: 'w-5 h-5',     dot: 'w-2.5 h-2.5', label: 'text-base', desc: 'text-sm' },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, size = 'md', className, id, disabled, ...props }, ref) => {
    const radioId = id ?? `radio-${Math.random().toString(36).slice(2, 7)}`;
    const sz = sizeStyles[size];

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'flex items-start gap-2.5 cursor-pointer group',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        {/* Radio Input */}
        <div className="relative flex shrink-0 items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            disabled={disabled}
            className={cn(
              'peer appearance-none rounded-full border-2 transition-all duration-150 cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              'border-secondary-300 group-hover:border-primary-400 checked:border-primary-600',
              sz.box,
              disabled && 'cursor-not-allowed',
            )}
          />
          {/* Dot */}
          <span
            className={cn(
              'absolute rounded-full bg-primary-600',
              'opacity-0 peer-checked:opacity-100 transition-all duration-150',
              'peer-checked:scale-100 scale-50',
              sz.dot,
            )}
            aria-hidden="true"
          />
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
    );
  },
);

Radio.displayName = 'Radio';

// ── RadioGroup ──────────────────────────────────────────────
export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  direction?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  direction = 'vertical',
  size = 'md',
}: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      {label && (
        <legend className="text-sm font-medium text-secondary-700 mb-1">{label}</legend>
      )}
      <div
        className={cn(
          'flex gap-3',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        )}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            id={`${name}-${opt.value}`}
            name={name}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={value === opt.value}
            disabled={opt.disabled}
            size={size}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-danger-600">{error}</p>
      )}
    </fieldset>
  );
}
