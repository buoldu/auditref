'use client';

import { useState, useEffect } from 'react';
import { Search, Copy, Filter } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';

const ScrollableTable = ({ children }: { children: React.ReactNode }) => {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [scrollContent, setScrollContent] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        height: 12px !important;
        width: 12px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9 !important;
        border-radius: 6px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1 !important;
        border-radius: 6px !important;
        border: 2px solid #f1f5f9 !important;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
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
      .top-scrollbar::-webkit-scrollbar {
        height: 12px !important;
        width: 12px !important;
      }
      .top-scrollbar::-webkit-scrollbar-track {
        background: #e2e8f0 !important;
        border-radius: 6px !important;
      }
      .top-scrollbar::-webkit-scrollbar-thumb {
        background: #64748b !important;
        border-radius: 6px !important;
        border: 2px solid #e2e8f0 !important;
      }
      .top-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #475569 !important;
      }
      .top-scrollbar {
        scrollbar-width: thin !important;
        scrollbar-color: #64748b #e2e8f0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainer && scrollContent) {
      scrollContent.scrollLeft = scrollContainer.scrollLeft;
    }
  };

  return (
    <div className="relative">
      {/* Top Horizontal Scrollbar */}
      <div 
        className="top-scrollbar overflow-x-auto overflow-y-hidden border border-slate-300 rounded-t-lg bg-slate-100"
        style={{ height: '12px' }}
        onScroll={handleScroll}
      >
        <div style={{ width: '1200px', height: '1px' }}></div>
      </div>
      
      {/* Main Table Container */}
      <div 
        ref={setScrollContainer}
        className="overflow-x-auto overflow-y-visible border border-t-0 border-slate-200 rounded-b-lg custom-scrollbar"
        onScroll={handleScroll}
      >
        <div ref={setScrollContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function TumVeriPage() {
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

  const copyToClipboard = async () => {
    const csvContent = [
      'Analiz Edilen Madde,İlişkili Rehber Maddesi,Kontrol Sorusu,Açıklama ve Gerekçe,Denetim Testi,Uygulama Notu',
      ...filteredItems.map(item => 
        `"${item.madde}","${item.rehberRef}","${item.soru}","${item.aciklama}","${item.prosedür}","${item.kanit}"`
      )
    ].join('\n');

    try {
      await navigator.clipboard.writeText(csvContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
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

  const handleColumnFilter = (column: keyof typeof columnFilters, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

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

    setFilteredItems(filtered);
  }, [searchQuery, items, columnFilters]);

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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Tüm Denetim Verileri</h1>
          <p className="text-sm sm:text-base text-slate-600">Tüm denetim maddelerini ve detaylarını görüntüleyin</p>
        </div>

        {/* Arama Barı */}
        <div className="mb-4 sm:mb-6">
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
          {searchQuery && (
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              {filteredItems.length} sonuç bulundu
            </p>
          )}
        </div>

        {/* Tablo */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {searchQuery && filteredItems.length > 0 && (
            <div className="px-3 sm:px-6 py-2 sm:py-3 bg-indigo-50 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 z-10 gap-2">
              <span className="text-xs sm:text-sm text-indigo-700 font-medium">
                {filteredItems.length} arama sonucu
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                {copySuccess ? 'Kopyalandı!' : 'Sonuçları Kopyala'}
              </button>
            </div>
          )}
          <ScrollableTable>
            <table className="min-w-[1200px] w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr className="border-b border-slate-200">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-xs">Analiz Edilen Madde</div>
                      <div className="relative">
                        <Filter className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={columnFilters.madde}
                          onChange={(e) => handleColumnFilter('madde', e.target.value)}
                          className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Filtrele..."
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[250px]">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-xs">İlişkili Rehber</div>
                      <div className="relative">
                        <Filter className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={columnFilters.rehberRef}
                          onChange={(e) => handleColumnFilter('rehberRef', e.target.value)}
                          className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Filtrele..."
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[300px]">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-xs">Kontrol Sorusu</div>
                      <div className="relative">
                        <Filter className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={columnFilters.soru}
                          onChange={(e) => handleColumnFilter('soru', e.target.value)}
                          className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Filtrele..."
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[350px]">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-xs">Açıklama</div>
                      <div className="relative">
                        <Filter className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={columnFilters.aciklama}
                          onChange={(e) => handleColumnFilter('aciklama', e.target.value)}
                          className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Filtrele..."
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[350px]">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-xs">Denetim Testi</div>
                      <div className="relative">
                        <Filter className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={columnFilters.prosedür}
                          onChange={(e) => handleColumnFilter('prosedür', e.target.value)}
                          className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Filtrele..."
                        />
                      </div>
                    </div>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[300px]">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs sm:text-xs">Uygulama Notu</div>
                      <div className="relative">
                        <Filter className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={columnFilters.kanit}
                          onChange={(e) => handleColumnFilter('kanit', e.target.value)}
                          className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Filtrele..."
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-slate-500 text-xs sm:text-sm">
                      {searchQuery ? 'Arama kriterlerinize uygun sonuç bulunamadı.' : 'Gösterilecek veri bulunamadı.'}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 align-top">
                        <div className="break-words leading-relaxed text-xs sm:text-sm">
                          {item.madde}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 align-top">
                        <div className="break-words leading-relaxed text-xs sm:text-sm">
                          {item.rehberRef}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 align-top">
                        <div className="break-words leading-relaxed text-xs sm:text-sm">
                          {item.soru}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 align-top">
                        <div className="break-words leading-relaxed max-h-24 sm:max-h-32 overflow-y-auto cell-scrollbar text-xs sm:text-sm">
                          {item.aciklama}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 align-top">
                        <div className="break-words leading-relaxed max-h-24 sm:max-h-32 overflow-y-auto cell-scrollbar text-xs sm:text-sm">
                          {item.prosedür}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-slate-600 align-top">
                        <div className="break-words leading-relaxed max-h-24 sm:max-h-32 overflow-y-auto cell-scrollbar text-xs sm:text-sm">
                          {item.kanit}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      </div>
    </div>
  );
}
