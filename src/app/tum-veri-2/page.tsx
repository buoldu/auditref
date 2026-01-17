'use client';

import { useState, useEffect } from 'react';
import { Search, Copy, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';

const sortedData = (items: AuditItem[], sortConfig: { key: keyof AuditItem | null; direction: 'asc' | 'desc' }) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

const EnhancedTable = ({ children }: { children: React.ReactNode }) => {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [scrollContent, setScrollContent] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .enhanced-scrollbar::-webkit-scrollbar {
        height: 12px !important;
        width: 12px !important;
      }
      .enhanced-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9 !important;
        border-radius: 6px !important;
      }
      .enhanced-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1 !important;
        border-radius: 6px !important;
        border: 2px solid #f1f5f9 !important;
      }
      .enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8 !important;
      }
      .cell-scrollbar::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }
      .cell-scrollbar::-webkit-scrollbar-track {
        background: #f8fafc !important;
        border-radius: 4px !important;
      }
      .cell-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1 !important;
        border-radius: 4px !important;
        border: 1px solid #f8fafc !important;
      }
      .cell-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8 !important;
      }
      .cell-scrollbar {
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e1 #f8fafc !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="enhanced-scrollbar overflow-x-auto overflow-y-visible border border-slate-200 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default function TumVeri2Page() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    madde: '',
    rehberRef: '',
    soru: '',
    aciklama: '',
    prosedür: '',
    kanit: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AuditItem | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const copyToClipboard = async () => {
    const csvContent = [
      'Analiz Edilen Madde,İlişkili Rehber Maddesi,Kontrol Sorusu,Açıklama ve Gerekçe,Denetim Testi,Uygulama Notu',
      ...filteredItems.map(item => {
        const madde = item.madde || '';
        const rehberRef = item.rehberRef || '';
        const soru = item.soru || '';
        const aciklama = item.aciklama || '';
        const prosedür = item.prosedür || '';
        const kanit = item.kanit || '';
        return `"${madde}","${rehberRef}","${soru}","${aciklama}","${prosedür}","${kanit}"`
      })
    ].join('\n');

    try {
      await navigator.clipboard.writeText(csvContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const handleColumnFilter = (column: keyof typeof columnFilters, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleSort = (key: keyof AuditItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await auditDataService.loadData();
        const allItems = auditDataService.getAllData();
        setItems(allItems);
        setFilteredItems(allItems);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = items;

    // Genel arama
    if (searchQuery.trim() !== '') {
      filtered = auditDataService.search(searchQuery);
    }

    // Kolon bazlı filtreler
    filtered = filtered.filter(item => {
      return (
        (columnFilters.madde === '' || item.madde.toLowerCase().includes(columnFilters.madde.toLowerCase())) &&
        (columnFilters.rehberRef === '' || item.rehberRef.toLowerCase().includes(columnFilters.rehberRef.toLowerCase())) &&
        (columnFilters.soru === '' || item.soru.toLowerCase().includes(columnFilters.soru.toLowerCase())) &&
        (columnFilters.aciklama === '' || item.aciklama.toLowerCase().includes(columnFilters.aciklama.toLowerCase())) &&
        (columnFilters.prosedür === '' || item.prosedür.toLowerCase().includes(columnFilters.prosedür.toLowerCase())) &&
        (columnFilters.kanit === '' || item.kanit.toLowerCase().includes(columnFilters.kanit.toLowerCase()))
      );
    });

    // Sıralama uygula
    const sortedFiltered = sortedData(filtered, sortConfig);
    setFilteredItems(sortedFiltered);
  }, [searchQuery, items, columnFilters, sortConfig]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Tüm Denetim Verileri 2</h1>
          <p className="text-sm sm:text-base text-slate-600">Gelişmiş tablo görünümü ve sıralama özellikleri</p>
        </div>

        {/* Arama ve Filtreler */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tüm dokümanlarda ara..."
              />
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm text-slate-600">
                {filteredItems.length} sonuç bulundu
              </span>
              {filteredItems.length > 0 && (
                <button
                  onClick={copyToClipboard}
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? 'Kopyalandı!' : 'Sonuçları Kopyala'}
                </button>
              )}
            </div>
          </div>

          {/* Hızlı Filtreler */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Madde</label>
              <input
                type="text"
                value={columnFilters.madde}
                onChange={(e) => handleColumnFilter('madde', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Rehber</label>
              <input
                type="text"
                value={columnFilters.rehberRef}
                onChange={(e) => handleColumnFilter('rehberRef', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Soru</label>
              <input
                type="text"
                value={columnFilters.soru}
                onChange={(e) => handleColumnFilter('soru', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Açıklama</label>
              <input
                type="text"
                value={columnFilters.aciklama}
                onChange={(e) => handleColumnFilter('aciklama', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Prosedür</label>
              <input
                type="text"
                value={columnFilters.prosedür}
                onChange={(e) => handleColumnFilter('prosedür', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kanıt</label>
              <input
                type="text"
                value={columnFilters.kanit}
                onChange={(e) => handleColumnFilter('kanit', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
          </div>
        </div>

        {/* Tablo */}
        <EnhancedTable>
          <table className="min-w-[1400px] w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[250px]">
                  <div className="flex items-center gap-2">
                    <span>Analiz Edilen Madde</span>
                    <button 
                      onClick={() => handleSort('madde')}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[300px]">
                  <div className="flex items-center gap-2">
                    <span>İlişkili Rehber</span>
                    <button 
                      onClick={() => handleSort('rehberRef')}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[350px]">
                  <div className="flex items-center gap-2">
                    <span>Kontrol Sorusu</span>
                    <button 
                      onClick={() => handleSort('soru')}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[400px]">
                  <div className="flex items-center gap-2">
                    <span>Açıklama ve Gerekçe</span>
                    <button 
                      onClick={() => handleSort('aciklama')}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[400px]">
                  <div className="flex items-center gap-2">
                    <span>Denetim Testi</span>
                    <button 
                      onClick={() => handleSort('prosedür')}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[350px]">
                  <div className="flex items-center gap-2">
                    <span>Uygulama Notu</span>
                    <button 
                      onClick={() => handleSort('kanit')}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {searchQuery ? 'Arama kriterlerinize uygun sonuç bulunamadı.' : 'Gösterilecek veri bulunamadı.'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 align-top border-r border-slate-100">
                      <div className="break-words leading-relaxed text-sm">
                        {item.madde}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 align-top border-r border-slate-100">
                      <div className="break-words leading-relaxed text-sm">
                        {item.rehberRef}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 align-top border-r border-slate-100">
                      <div className="break-words leading-relaxed text-sm">
                        {item.soru}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 align-top border-r border-slate-100">
                      <div className="break-words leading-relaxed max-h-32 overflow-y-auto cell-scrollbar text-sm">
                        {item.aciklama}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 align-top border-r border-slate-100">
                      <div className="break-words leading-relaxed max-h-32 overflow-y-auto cell-scrollbar text-sm whitespace-pre-line">
                        {item.prosedür}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 align-top">
                      <div className="break-words leading-relaxed max-h-32 overflow-y-auto cell-scrollbar text-sm">
                        {item.kanit}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </EnhancedTable>
      </div>
    </div>
  );
}
