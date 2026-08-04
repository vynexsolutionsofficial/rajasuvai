import React from 'react';
import { Search } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { cn } from '../../lib/cn';

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  emptyTitle = 'No records found',
  emptyDescription,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white">
      {(onSearchChange || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 p-4">
          {onSearchChange && (
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-black/35" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-black/10 pl-9 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/5">
              {columns.map((col, i) => (
                <th key={i} className={cn('px-4 py-3 text-xs font-bold tracking-wide text-black/40 whitespace-nowrap', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3.5"><Skeleton className="h-4 w-full max-w-[140px]" /></td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-black/[0.015]">
                  {columns.map((col, i) => (
                    <td key={i} className={cn('px-4 py-3.5 align-middle whitespace-nowrap', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
