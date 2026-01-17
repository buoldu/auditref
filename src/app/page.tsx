'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuditDetail } from '@/components/AuditDetail';
import { AuditItem, auditDataService } from '@/lib/audit-data';

export default function Home() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await auditDataService.loadData();
        const allItems = auditDataService.getAllData();
        setItems(allItems);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-1/3 min-w-0">
        <Sidebar
          items={items}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
      </div>
      <div className="w-2/3 min-w-0">
        <AuditDetail item={selectedItem} />
      </div>
    </div>
  );
}
