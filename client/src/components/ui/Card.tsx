// ============================================================
// Card Component
// ============================================================
import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ── Card ────────────────────────────────────────────────────
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

const variantStyles = {
  default:  'bg-white dark:bg-[#1a1712] border border-secondary-200 dark:border-[#4d4635] shadow-card dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]',
  elevated: 'bg-white dark:bg-[#1a1712] border border-secondary-100 dark:border-[#4d4635] shadow-elevated dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]',
  flat:     'bg-secondary-50 dark:bg-[#1a1712]/50 border border-transparent',
  bordered: 'bg-white dark:bg-[#1a1712] border-2 border-secondary-200 dark:border-[#4d4635]',
};

const paddingStyles = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6 md:p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      interactive = false,
      as: Tag = 'div',
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        onClick={onClick}
        className={cn(
          'rounded-xl overflow-hidden',
          variantStyles[variant],
          paddingStyles[padding],
          interactive && [
            'cursor-pointer transition-all duration-200',
            'hover:-translate-y-0.5 hover:shadow-card-hover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          ],
          className,
        )}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Card.displayName = 'Card';

// ── CardHeader ──────────────────────────────────────────────
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({ title, description, action, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)} {...props}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="font-semibold text-secondary-900 dark:text-[#eae1d4] text-heading-sm">{title}</h3>
        )}
        {description && (
          <p className="mt-0.5 text-sm text-secondary-500 dark:text-[#d0c5af]">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ── CardBody ────────────────────────────────────────────────
export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

// ── CardFooter ──────────────────────────────────────────────
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}

export function CardFooter({ separator = true, className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center gap-3',
        separator && 'pt-4 border-t border-secondary-100 dark:border-[#4d4635]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
