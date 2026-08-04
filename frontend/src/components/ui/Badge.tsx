import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'brand' | 'fresh' | 'warning' | 'error' | 'neutral';

const variantClasses: Record<Variant, string> = {
  brand: 'bg-brand-50 text-brand-700',
  fresh: 'bg-fresh-100 text-fresh-700',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-error-50 text-error-600',
  neutral: 'bg-black/5 text-black/70',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
