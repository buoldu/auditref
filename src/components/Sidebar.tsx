'use client';

import { useState, useEffect } from 'react';
import { SearchInput } from './SearchInput';
import { AuditCard } from './AuditCard';
import { AuditItem } from '@/lib/audit-data';
import { cn } from '@/lib/utils';

interface SidebarProps {
  items: AuditItem[];
  selectedItem: AuditItem | null;
  onSelectItem: (item: AuditItem) => void;
  className?: string;
}

export function Sidebar({ items, selectedItem, onSelectItem, className }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<AuditItem[]>(items);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.madde.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.soru.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rehberRef.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-slate-200", className)}>
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Denetim Maddeleri</h2>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Madde ara..."
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Sonuç bulunamadı</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <AuditCard
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onClick={() => onSelectItem(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}
