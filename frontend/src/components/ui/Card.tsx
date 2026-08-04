import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-2xl border border-black/5 bg-white shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';
