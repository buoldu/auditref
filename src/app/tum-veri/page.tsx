'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Copy, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
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

const VirtualizedTable = ({ children }: { children: React.ReactNode }) => {
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
      .dark .enhanced-scrollbar::-webkit-scrollbar-track {
        background: #1e293b !important;
      }
      .dark .enhanced-scrollbar::-webkit-scrollbar-thumb {
        background: #475569 !important;
        border-color: #1e293b !important;
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
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .line-clamp-4 {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden">
      <div className="enhanced-scrollbar overflow-x-auto overflow-y-visible border border-slate-200 dark:border-slate-700 rounded-lg">
        {children}
      </div>
    </div>
  );
};

const VirtualizedRow = ({ index, style, data }: { index: number; style: React.CSSProperties; data: any }) => {
  const { filteredItems, selectedItems, toggleSelection, expandedRows, toggleRowExpansion } = data;
  const item = filteredItems[index];
  const isExpanded = expandedRows.has(item.id);
  
  return (
    <div className={`border-b border-slate-200 dark:border-slate-700 ${
      index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/50'
    } hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50 dark:hover:from-slate-800 dark:hover:to-indigo-950 transition-all duration-200`}>
      {/* Main row */}
      <div className="flex items-stretch">
        {/* Checkbox cell */}
        <div className="w-[5%] px-3 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-center border-r border-slate-100 dark:border-slate-700">
          <input
            type="checkbox"
            checked={selectedItems.has(item.id)}
            onChange={() => toggleSelection(item.id)}
            className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 flex-shrink-0"
          />
        </div>
        
        {/* Madde cell - Clickable */}
        <div 
          className="w-[12%] px-3 py-4 text-sm font-medium text-slate-900 dark:text-slate-100 flex items-start border-r border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
          onClick={() => toggleRowExpansion(item.id)}
        >
          <div className="w-full">
            <p className="break-words leading-relaxed text-sm line-clamp-2">
              {item.madde}
            </p>
            <span className="text-xs text-indigo-600 mt-1 block">
              {isExpanded ? 'Daralt ▲' : 'Genişlet ▼'}
            </span>
          </div>
        </div>
        
        {/* Rehber cell */}
        <div className="w-[15%] px-3 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-start border-r border-slate-100 dark:border-slate-700">
          <div className="w-full">
            <p className="break-words leading-relaxed text-sm line-clamp-2">
              {item.rehberRef}
            </p>
          </div>
        </div>
        
        {/* Soru cell */}
        <div className="w-[20%] px-3 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-start border-r border-slate-100 dark:border-slate-700">
          <div className="w-full">
            <p className="break-words leading-relaxed text-sm line-clamp-2">
              {item.soru}
            </p>
          </div>
        </div>
        
        {/* Açıklama cell */}
        <div className="w-[20%] px-3 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-start border-r border-slate-100 dark:border-slate-700">
          <div className="w-full">
            <p className="break-words leading-relaxed text-sm line-clamp-2">
              {item.aciklama}
            </p>
          </div>
        </div>
        
        {/* Prosedür cell */}
        <div className="w-[14%] px-3 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-start border-r border-slate-100 dark:border-slate-700">
          <div className="w-full">
            <p className="break-words leading-relaxed text-sm line-clamp-2">
              {item.prosedür}
            </p>
          </div>
        </div>
        
        {/* Kanıt cell */}
        <div className="w-[14%] px-3 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-start">
          <div className="w-full">
            <p className="break-words leading-relaxed text-sm line-clamp-2">
              {item.kanit}
            </p>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="bg-gradient-to-r from-indigo-50 to-slate-50 dark:from-indigo-950 dark:to-slate-900 border-l-4 border-indigo-400 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Analiz Edilen Madde</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                  {item.madde}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">İlişkili Rehber</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                  {item.rehberRef}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Kontrol Sorusu</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                  {item.soru}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Açıklama ve Gerekçe</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                  {item.aciklama}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Denetim Testi (Prosedür)</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                  {item.prosedür}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Uygulama Notu / Örnek Kanıt</h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-600">
                  {item.kanit}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TumVeri2Page() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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
  const tableRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  const copyToClipboard = async () => {
    const selectedData = filteredItems.filter(item => selectedItems.has(item.id));
    
    if (selectedData.length === 0) {
      // Hiç seçim yoksa uyarı ver
      alert('Lütfen kopyalamak için en az bir madde seçin.');
      return;
    }
    
    // Debug: konsola yazdır
    console.log('Toplam filtrelenmiş:', filteredItems.length);
    console.log('Seçili maddeler:', selectedData.length);
    
    // Sadece seçili maddeleri kopyala
    let content = 'Analiz Edilen Madde\tİlişkili Rehber\tKontrol Sorusu\tAçıklama ve Gerekçe\tDenetim Testi\tUygulama Notu\n';
    
    selectedData.forEach(item => {
      const madde = (item.madde || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
      const rehberRef = (item.rehberRef || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
      const soru = (item.soru || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
      const aciklama = (item.aciklama || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
      const prosedür = (item.prosedür || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
      const kanit = (item.kanit || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
      
      content += `${madde}\t${rehberRef}\t${soru}\t${aciklama}\t${prosedür}\t${kanit}\n`;
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setInitialScrollLeft(tableRef.current.scrollLeft);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !tableRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    tableRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Restore text selection
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startX, initialScrollLeft]);

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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-3 flex items-baseline gap-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tüm Denetim Verileri</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gelişmiş tablo görünümü ve sıralama</p>
        </div>

        {/* Arama ve Filtreler */}
        <div className="mb-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 text-black dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tüm dokümanlarda ara..."
              />
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {filteredItems.length} sonuç bulundu
                {selectedItems.size > 0 && (
                  <span className="ml-2 text-indigo-600 font-medium">
                    ({selectedItems.size} seçili)
                  </span>
                )}
              </span>
              {filteredItems.length > 0 && (
                <button
                  onClick={copyToClipboard}
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? 'Kopyalandı!' : (selectedItems.size > 0 ? `${selectedItems.size} Maddeleri Kopyala` : 'Seçimleri Kopyala')}
                </button>
              )}
            </div>
          </div>

          {/* Hızlı Filtreler */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Madde</label>
              <input
                type="text"
                value={columnFilters.madde}
                onChange={(e) => handleColumnFilter('madde', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Rehber</label>
              <input
                type="text"
                value={columnFilters.rehberRef}
                onChange={(e) => handleColumnFilter('rehberRef', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Soru</label>
              <input
                type="text"
                value={columnFilters.soru}
                onChange={(e) => handleColumnFilter('soru', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Açıklama</label>
              <input
                type="text"
                value={columnFilters.aciklama}
                onChange={(e) => handleColumnFilter('aciklama', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Prosedür</label>
              <input
                type="text"
                value={columnFilters.prosedür}
                onChange={(e) => handleColumnFilter('prosedür', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Kanıt</label>
              <input
                type="text"
                value={columnFilters.kanit}
                onChange={(e) => handleColumnFilter('kanit', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Filtrele..."
              />
            </div>
          </div>
        </div>

        {/* Tablo */}
        <VirtualizedTable>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800 sticky top-0 z-10">
              <div className="flex items-stretch border-b border-slate-200 dark:border-slate-700">
                <div className="w-[5%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span>Seç</span>
                  </div>
                </div>
                <div className="w-[12%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Analiz Edilen Madde</span>
                    <button 
                      onClick={() => handleSort('madde')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="w-[15%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>İlişkili Rehber</span>
                    <button 
                      onClick={() => handleSort('rehberRef')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="w-[20%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Kontrol Sorusu</span>
                    <button 
                      onClick={() => handleSort('soru')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="w-[20%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Açıklama ve Gerekçe</span>
                    <button 
                      onClick={() => handleSort('aciklama')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="w-[14%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Denetim Testi</span>
                    <button 
                      onClick={() => handleSort('prosedür')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="w-[14%] px-4 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Uygulama Notu</span>
                    <button 
                      onClick={() => handleSort('kanit')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Virtualized Body */}
            {filteredItems.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                {searchQuery ? 'Arama kriterlerinize uygun sonuç bulunamadı.' : 'Gösterilecek veri bulunamadı.'}
              </div>
            ) : (
              <div className="enhanced-scrollbar overflow-y-auto" style={{ height: '600px' }}>
                {filteredItems.map((item, index) => (
                  <VirtualizedRow
                    key={item.id}
                    index={index}
                    style={{}}
                    data={{
                      filteredItems,
                      selectedItems,
                      expandedRows,
                      toggleSelection,
                      toggleRowExpansion
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </VirtualizedTable>
      </div>
    </div>
  );
}
