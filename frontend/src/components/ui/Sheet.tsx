import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'bottom' | 'right';
  className?: string;
}

export function Sheet({ open, onClose, title, children, side = 'bottom', className }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const panelVariants =
    side === 'bottom'
      ? { hidden: { y: '100%' }, visible: { y: 0 } }
      : { hidden: { x: '100%' }, visible: { x: 0 } };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cn('fixed inset-0 z-50 flex', side === 'bottom' ? 'flex-col justify-end' : 'flex-row justify-end')}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'relative flex flex-col bg-white shadow-xl',
              side === 'bottom'
                ? 'max-h-[85vh] w-full rounded-t-2xl'
                : 'h-full w-full max-w-sm',
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <h2 className="text-base font-semibold text-brand-950">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-full text-black/50 hover:bg-black/5"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
