// ============================================================
// EmptyState Component
// ============================================================
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  illustration?: 'parking' | 'search' | 'bookmark' | 'inbox' | 'map';
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Built-in SVG Illustrations
const illustrations = {
  parking: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full" aria-hidden="true">
      <rect x="10" y="20" width="100" height="80" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
      <rect x="25" y="40" width="30" height="40" rx="4" fill="#DBEAFE" />
      <text x="35" y="67" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#2563EB">P</text>
      <rect x="65" y="55" width="30" height="25" rx="3" fill="#93C5FD" />
      <circle cx="72" cy="80" r="4" fill="#1D4ED8" />
      <circle cx="87" cy="80" r="4" fill="#1D4ED8" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full" aria-hidden="true">
      <circle cx="52" cy="52" r="32" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="3" />
      <circle cx="52" cy="52" r="20" fill="#DBEAFE" />
      <line x1="76" y1="76" x2="100" y2="100" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
      <circle cx="52" cy="52" r="8" fill="#93C5FD" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full" aria-hidden="true">
      <path d="M35 20h50a5 5 0 015 5v75L60 85 30 100V25a5 5 0 015-5z" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
      <path d="M48 50h24M48 62h16" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full" aria-hidden="true">
      <rect x="15" y="30" width="90" height="65" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
      <path d="M15 60h35l10 12 10-12h35" stroke="#93C5FD" strokeWidth="2" />
      <path d="M35 45h50M35 52h35" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full" aria-hidden="true">
      <path d="M44 20L20 30v70l24-8 32 8 24-10V20L76 28 44 20z" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
      <path d="M44 20v70M76 28v70" stroke="#BFDBFE" strokeWidth="2" />
      <circle cx="60" cy="52" r="10" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2" />
      <circle cx="60" cy="52" r="4" fill="#2563EB" />
    </svg>
  ),
};

const sizeStyles = {
  sm: { wrapper: 'py-8',  illus: 'w-24 h-24', title: 'text-base', desc: 'text-sm'  },
  md: { wrapper: 'py-12', illus: 'w-32 h-32', title: 'text-lg',   desc: 'text-sm'  },
  lg: { wrapper: 'py-16', illus: 'w-40 h-40', title: 'text-xl',   desc: 'text-base' },
};

export function EmptyState({
  icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className,
}: EmptyStateProps) {
  const sz = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        sz.wrapper,
        className,
      )}
      role="status"
    >
      {/* Illustration or Icon */}
      {illustration ? (
        <div className={cn('mb-6', sz.illus)}>
          {illustrations[illustration]}
        </div>
      ) : icon ? (
        <div className="mb-4 p-4 bg-secondary-100 rounded-2xl text-secondary-400">
          {icon}
        </div>
      ) : null}

      <h3 className={cn('font-semibold text-secondary-900 text-balance', sz.title)}>
        {title}
      </h3>

      {description && (
        <p className={cn('mt-2 text-secondary-500 max-w-sm text-pretty', sz.desc)}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
