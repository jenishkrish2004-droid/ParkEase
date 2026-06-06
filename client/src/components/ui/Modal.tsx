// ============================================================
// Modal Component
// ============================================================
import { useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeStyles: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-full mx-4',
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
  children,
  footer,
  className,
  hideCloseButton = false,
}: ModalProps) {
  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') onClose();
    },
    [closeOnEsc, onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary-900/50 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-modal',
          'flex flex-col max-h-[90vh]',
          'animate-scale-in',
          sizeStyles[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-secondary-100">
            <div className="flex-1 min-w-0 pr-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-secondary-900 truncate"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-secondary-500">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={cn(
                  'shrink-0 p-1.5 rounded-lg text-secondary-400',
                  'hover:bg-secondary-100 hover:text-secondary-600',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                )}
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-secondary-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
