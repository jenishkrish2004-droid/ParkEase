// ============================================================
// Sidebar Layout Component
// ============================================================
import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  exact?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  className?: string;
}

function NavItem({
  item,
  collapsed,
}: {
  item: SidebarItem;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.href
    : location.pathname.startsWith(item.href);

  return (
    <Link
      to={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
        'transition-all duration-150 no-underline group',
        collapsed ? 'justify-center' : '',
        isActive
          ? 'bg-primary-50 text-primary-700 shadow-sm'
          : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900',
      )}
    >
      {item.icon && (
        <span
          className={cn(
            'shrink-0 w-5 h-5 transition-colors',
            isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600',
          )}
        >
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded-full font-medium',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-secondary-200 text-secondary-600',
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function Sidebar({ sections, header, footer, collapsed = false, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white border-r border-secondary-200',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      {header && (
        <div className={cn('px-4 py-5 border-b border-secondary-100', collapsed && 'px-2')}>
          {header}
        </div>
      )}

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 flex flex-col gap-6">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && !collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-secondary-400">
                {section.title}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className={cn('border-t border-secondary-100 p-4', collapsed && 'p-2')}>
          {footer}
        </div>
      )}
    </aside>
  );
}
