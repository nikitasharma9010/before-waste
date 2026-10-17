import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  descriptionId?: string;
  description?: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
  maxWidthClass?: string;
}

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  isOpen,
  onClose,
  titleId,
  title,
  descriptionId,
  description,
  children,
  triggerRef,
  maxWidthClass = 'max-w-2xl'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember the element that had focus before the dialog opened
    previouslyFocusedElement.current = (document.activeElement as HTMLElement) || triggerRef?.current || null;

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog
    const focusTimer = setTimeout(() => {
      if (dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 50);

    // Trap focus and handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previous element or triggerRef
      const returnTarget = triggerRef?.current || previouslyFocusedElement.current;
      if (returnTarget && typeof returnTarget.focus === 'function') {
        setTimeout(() => {
          returnTarget.focus();
        }, 10);
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#202A35]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`bg-[#FFF9F0] text-[#202A35] rounded-3xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col border border-[#202A35]/15 shadow-2xl focus:outline-none animate-in fade-in zoom-in-95 duration-200 my-auto`}
      >
        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-7 border-b border-[#202A35]/10 shrink-0">
          <div>
            <h2 id={titleId} className="font-editorial text-2xl font-bold text-[#202A35]">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-xs sm:text-sm text-[#202A35]/70 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-[#202A35]/70 hover:text-[#202A35] hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Body (scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-sm text-[#202A35]/85">
          {children}
        </div>
      </div>
    </div>
  );
};
