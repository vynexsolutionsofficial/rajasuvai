import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}>
      {icon && (
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-brand-950">{title}</h3>
      {description && <p className="max-w-sm text-sm text-black/50">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
