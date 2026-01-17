'use client';

import { AuditItem } from '@/lib/audit-data';
import { cn } from '@/lib/utils';

interface AuditCardProps {
  item: AuditItem;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AuditCard({ item, isSelected, onClick, className }: AuditCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-indigo-300 hover:shadow-sm",
        isSelected && "bg-slate-100 border-indigo-500 shadow-sm",
        className
      )}
    >
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
        {item.madde}
      </h3>
      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
        {item.soru}
      </p>
      {item.rehberRef && (
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
          {item.rehberRef}
        </div>
      )}
    </div>
  );
}
