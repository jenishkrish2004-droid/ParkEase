// ============================================================
// PageLayout — Standard page with Header + Footer
// ============================================================
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Footer } from './Footer';

export interface PageLayoutProps {
  children: ReactNode;
  headerTransparent?: boolean;
  showFooter?: boolean;
  showMobileNav?: boolean;
  className?: string;
  mainClassName?: string;
}

export function PageLayout({
  children,
  headerTransparent = false,
  showFooter = true,
  className,
  mainClassName,
}: PageLayoutProps) {
  return (
    <div className={cn('flex flex-col min-h-screen', className)}>
      <Header transparent={headerTransparent} />
      <main
        className={cn('flex-1', mainClassName)}
        id="main-content"
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

// ============================================================
// DashboardLayout — Sidebar + Main content
// ============================================================
import { useState } from 'react';
import { Sidebar, type SidebarSection } from './Sidebar';

export interface DashboardLayoutProps {
  children: ReactNode;
  sidebarSections: SidebarSection[];
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function DashboardLayout({
  children,
  sidebarSections,
  sidebarHeader,
  sidebarFooter,
  title,
  description,
  actions,
  breadcrumb,
  className,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn('flex min-h-screen bg-secondary-50', className)}>
      {/* Sidebar */}
      <Sidebar
        sections={sidebarSections}
        header={sidebarHeader}
        footer={sidebarFooter}
        collapsed={collapsed}
        className="hidden md:flex sticky top-0 h-screen"
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Header Bar */}
        <div className="sticky top-0 z-50 bg-white border-b border-secondary-200">
          <div className="px-6 h-16 flex items-center gap-4">
            {/* Collapse Toggle */}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'hidden md:flex items-center justify-center w-8 h-8 rounded-lg',
                'text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700',
                'transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Breadcrumb */}
            {breadcrumb && (
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
                {breadcrumb.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <svg className="w-3.5 h-3.5 text-secondary-300 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {crumb.href ? (
                      <Link to={crumb.href} className="text-sm text-secondary-500 hover:text-secondary-700 no-underline truncate">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-secondary-900 truncate">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <div className="flex-1" />

            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(title || description) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
              )}
              {description && (
                <p className="mt-1 text-sm text-secondary-500">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
