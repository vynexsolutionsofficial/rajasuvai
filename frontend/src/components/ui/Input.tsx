import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-sm text-brand-950 placeholder:text-black/40',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
            icon && 'pl-10',
            error && 'border-error-500 focus:ring-error-500/30 focus:border-error-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-error-600">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
