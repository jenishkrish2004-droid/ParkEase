// ============================================================
// Avatar Component
// ============================================================
import { type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs:  { container: 'w-6 h-6',   text: 'text-[10px]' },
  sm:  { container: 'w-8 h-8',   text: 'text-xs'     },
  md:  { container: 'w-10 h-10', text: 'text-sm'     },
  lg:  { container: 'w-12 h-12', text: 'text-base'   },
  xl:  { container: 'w-16 h-16', text: 'text-xl'     },
  '2xl': { container: 'w-20 h-20', text: 'text-2xl'  },
};

// Consistent color palettes for initials-based avatars
const colorPalettes = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-indigo-100 text-indigo-700',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalettes[Math.abs(hash) % colorPalettes.length];
}

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'rounded';
  online?: boolean;
  className?: string;
}

export function Avatar({
  src,
  firstName = '',
  lastName = '',
  size = 'md',
  shape = 'circle',
  online,
  className,
  alt,
  ...props
}: AvatarProps) {
  const sz = sizeStyles[size];
  const initials = firstName || lastName
    ? getInitials(firstName || '?', lastName || '')
    : '?';
  const colorClass = getAvatarColor(firstName + lastName);

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className={cn('relative shrink-0 inline-flex', sz.container, className)}>
      {src ? (
        <img
          src={src}
          alt={alt ?? `${firstName} ${lastName}`}
          className={cn(
            'w-full h-full object-cover',
            shapeClass,
            'ring-2 ring-white',
          )}
          {...props}
        />
      ) : (
        <span
          className={cn(
            'w-full h-full flex items-center justify-center font-semibold select-none',
            shapeClass,
            colorClass,
            sz.text,
          )}
          aria-label={`${firstName} ${lastName}` || 'User avatar'}
        >
          {initials}
        </span>
      )}

      {/* Online Indicator */}
      {online !== undefined && (
        <span
          aria-label={online ? 'Online' : 'Offline'}
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            online ? 'bg-success-500' : 'bg-secondary-300',
          )}
        />
      )}
    </div>
  );
}

// ── AvatarGroup ─────────────────────────────────────────────
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    firstName?: string;
    lastName?: string;
  }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((avatar, i) => (
        <div
          key={i}
          className={cn(
            'ring-2 ring-white rounded-full',
            i > 0 && '-ml-2',
          )}
          style={{ zIndex: visible.length - i }}
        >
          <Avatar
            src={avatar.src}
            firstName={avatar.firstName}
            lastName={avatar.lastName}
            size={size}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            '-ml-2 flex items-center justify-center rounded-full ring-2 ring-white',
            'bg-secondary-200 text-secondary-600 font-medium text-xs',
            sizeStyles[size].container,
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
