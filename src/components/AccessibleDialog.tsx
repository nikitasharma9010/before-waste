import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  fallbackFocusRef?: React.RefObject<HTMLElement | null>;
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
  fallbackFocusRef,
  maxWidthClass = 'max-w-2xl'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The portal is a body child, so no ancestor of the dialog is made inert.
    const backgrounds = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== overlayRef.current
    );
    const inertStates = backgrounds.map(element => [element, element.inert] as const);
    backgrounds.forEach(element => { element.inert = true; });
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []).filter(element => !element.closest('[hidden], [inert]'));
    const moveInside = () => (focusable()[0] || dialogRef.current)?.focus();
    moveInside();
    const handleFocus = (event: FocusEvent) => {
      if (!dialogRef.current?.contains(event.target as Node)) moveInside();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) { event.preventDefault(); dialogRef.current?.focus(); return; }
        if (!dialogRef.current?.contains(document.activeElement) ||
            (event.shiftKey && document.activeElement === first) ||
            (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener('focusin', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('focusin', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      inertStates.forEach(([element, inert]) => { element.inert = inert; });
      const target = [triggerRef?.current, previous, fallbackFocusRef?.current].find(
        element => element?.isConnected && element !== document.body && !element.closest('[inert]')
      );
      target?.focus();
    };
  }, [isOpen, triggerRef, fallbackFocusRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
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
        className={`bg-paper text-ink rounded-3xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col border border-ink/15 shadow-2xl focus:outline-none animate-in fade-in zoom-in-95 duration-200 my-auto`}
      >
        {/* Dialog Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-7 border-b border-ink/10 shrink-0">
          <div>
            <h2 id={titleId} className="font-editorial text-2xl font-bold text-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-xs sm:text-sm text-ink/75 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-ink/75 hover:text-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Body (scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-sm text-ink/85">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
