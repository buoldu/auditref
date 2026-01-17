'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Filter, Download, CheckSquare, Square } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';

interface SearchFilters {
  madde: string;
  rehberRef: string;
  soru: string;
  aciklama: string;
  prosedür: string;
  kanit: string;
}

export default function BasitListePage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    madde: '',
    rehberRef: '',
    soru: '',
    aciklama: '',
    prosedür: '',
    kanit: ''
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
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

  const exportToExcel = () => {
    const selectedData = filteredItems.filter(item => selectedItems.has(item.id));
    
    if (selectedData.length === 0) {
      alert('Lütfen dışa aktarmak için en az bir madde seçin.');
      return;
    }

    // CSV formatında veri oluştur
    const csvContent = [
      'Analiz Edilen Madde,İlişkili Rehber Maddesi,Kontrol Sorusu,Açıklama ve Gerekçe,Denetim Testi (Prosedür),Uygulama Notu / Örnek Kanıt',
      ...selectedData.map(item => 
        `"${item.madde}","${item.rehberRef}","${item.soru}","${item.aciklama}","${item.prosedür}","${item.kanit}"`
      )
    ].join('\n');

    // Blob oluştur ve indir
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `secilen_maddeler_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter(item => {
    // Genel arama
    const generalMatch = searchQuery.trim() === '' || 
      item.madde.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rehberRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.soru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aciklama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prosedür.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kanit.toLowerCase().includes(searchQuery.toLowerCase());

    // Detaylı filtreler
    const detailMatch = 
      (filters.madde === '' || item.madde.toLowerCase().includes(filters.madde.toLowerCase())) &&
      (filters.rehberRef === '' || item.rehberRef.toLowerCase().includes(filters.rehberRef.toLowerCase())) &&
      (filters.soru === '' || item.soru.toLowerCase().includes(filters.soru.toLowerCase())) &&
      (filters.aciklama === '' || item.aciklama.toLowerCase().includes(filters.aciklama.toLowerCase())) &&
      (filters.prosedür === '' || item.prosedür.toLowerCase().includes(filters.prosedür.toLowerCase())) &&
      (filters.kanit === '' || item.kanit.toLowerCase().includes(filters.kanit.toLowerCase()));

    return generalMatch && detailMatch;
  });

  const clearFilters = () => {
    setFilters({
      madde: '',
      rehberRef: '',
      soru: '',
      aciklama: '',
      prosedür: '',
      kanit: ''
    });
    setSearchQuery('');
  };

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Gelişmiş Veri Listesi</h1>
          <p className="text-slate-600">Detaylı arama, filtreleme ve seçme ile verileri keşfedin</p>
        </div>

        {/* Arama Barı */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-20 py-3 border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Tüm başlıklarda ara..."
            />
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {/* Gelişmiş Arama */}
          {showAdvancedSearch && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Analiz Edilen Madde</label>
                  <input
                    type="text"
                    value={filters.madde}
                    onChange={(e) => setFilters({...filters, madde: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Madde ara..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rehber Maddesi</label>
                  <input
                    type="text"
                    value={filters.rehberRef}
                    onChange={(e) => setFilters({...filters, rehberRef: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Rehber ara..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kontrol Sorusu</label>
                  <input
                    type="text"
                    value={filters.soru}
                    onChange={(e) => setFilters({...filters, soru: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Soru ara..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                  <input
                    type="text"
                    value={filters.aciklama}
                    onChange={(e) => setFilters({...filters, aciklama: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Açıklama ara..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Denetim Testi</label>
                  <input
                    type="text"
                    value={filters.prosedür}
                    onChange={(e) => setFilters({...filters, prosedür: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Prosedür ara..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Uygulama Notu</label>
                  <input
                    type="text"
                    value={filters.kanit}
                    onChange={(e) => setFilters({...filters, kanit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Kanıt ara..."
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Temizle
                </button>
              </div>
            </div>
          )}

          {/* Seçim ve Dışa Aktarma Butonları */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900"
              >
                {selectedItems.size === filteredItems.length && filteredItems.length > 0 ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>
                  {selectedItems.size === filteredItems.length && filteredItems.length > 0 
                    ? 'Tümünü Seçimi Kaldır' 
                    : 'Tümünü Seç'}
                </span>
              </button>
              {selectedItems.size > 0 && (
                <span className="text-sm text-indigo-600 font-medium">
                  {selectedItems.size} madde seçildi
                </span>
              )}
            </div>
            <button
              onClick={exportToExcel}
              disabled={selectedItems.size === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedItems.size > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Excel'e Aktar</span>
            </button>
          </div>

          {(searchQuery || Object.values(filters).some(f => f !== '')) && (
            <p className="text-sm text-slate-600">
              {filteredItems.length} sonuç bulundu
            </p>
          )}
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-slate-500">
                {(searchQuery || Object.values(filters).some(f => f !== '')) 
                  ? 'Arama kriterlerinize uygun sonuç bulunamadı.' 
                  : 'Gösterilecek veri bulunamadı.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelection(item.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {selectedItems.has(item.id) ? (
                        <CheckSquare className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>

                    {/* Content */}
                    <div 
                      className="flex-1 cursor-pointer hover:bg-slate-50 -m-2 p-2 rounded transition-colors"
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.madde}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">Rehber:</span>
                              <p className="text-slate-600">{item.rehberRef}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Soru:</span>
                              <p className="text-slate-600">{item.soru}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center">
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedItems.has(item.id) && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Açıklama ve Gerekçe</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.aciklama}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Denetim Testi (Prosedür)</h4>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{item.prosedür}</p>
                      </div>
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-slate-900 mb-2">Uygulama Notu / Örnek Kanıt</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.kanit}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
