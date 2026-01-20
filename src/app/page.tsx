'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, FileText, Building2, Shield, CheckCircle, Copy, ChevronDown as DropdownIcon } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';

export default function Home() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const [version, setVersion] = useState('0.1.1');
  
  // Geliştirme zaman damgası
  const buildTimestamp = new Date().toLocaleString('tr-TR', { 
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Versiyonu artırma fonksiyonu
  useEffect(() => {
    const incrementVersion = () => {
      const parts = version.split('.');
      const patch = parseInt(parts[2]) + 1;
      setVersion(`${parts[0]}.${parts[1]}.${patch}`);
    };
    
    // Her build'te versiyonu artır
    incrementVersion();
  }, []);

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

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getGroupedItems = () => {
    const grouped: { [key: string]: AuditItem[] } = {};
    
    items.forEach(item => {
      // Ana kategoriyi belirle (ilk kelime veya ilk cümle)
      const category = item.madde.split(' ')[0] || item.madde.substring(0, 20);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  };

  const filteredGroupedItems = () => {
    const grouped = getGroupedItems();
    const filtered: { [key: string]: AuditItem[] } = {};

    Object.keys(grouped).forEach(category => {
      if (searchQuery.trim() === '') {
        filtered[category] = grouped[category];
      } else {
        const categoryItems = grouped[category].filter(item =>
          item.madde.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.rehberRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.soru.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (categoryItems.length > 0) {
          filtered[category] = categoryItems;
        }
      }
    });

    return filtered;
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('alacak') || category.toLowerCase().includes('kredi')) {
      return <Building2 className="h-5 w-5 text-indigo-600" />;
    } else if (category.toLowerCase().includes('denetim') || category.toLowerCase().includes('kontrol')) {
      return <Shield className="h-5 w-5 text-green-600" />;
    } else if (category.toLowerCase().includes('süreç') || category.toLowerCase().includes('yönetim')) {
      return <CheckCircle className="h-5 w-5 text-blue-600" />;
    } else {
      return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  const copySelectedItem = async () => {
    if (!selectedItem) return;
    
    const content = `Analiz Edilen Madde: ${selectedItem.madde || ''}
İlişkili Rehber: ${selectedItem.rehberRef || ''}
Kontrol Sorusu: ${selectedItem.soru || ''}
Açıklama ve Gerekçe: ${selectedItem.aciklama || ''}
Denetim Testi: ${selectedItem.prosedür || ''}
Uygulama Notu: ${selectedItem.kanit || ''}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const copyAsTable = async () => {
    if (!selectedItem) return;
    
    // Excel CSV formatı - virgülle ayrılmış ve tırnak içinde
    const cleanText = (text: string) => {
      if (!text) return '';
      return text.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\t/g, ' ');
    };
    
    const madde = cleanText(selectedItem.madde || '');
    const rehberRef = cleanText(selectedItem.rehberRef || '');
    const soru = cleanText(selectedItem.soru || '');
    const aciklama = cleanText(selectedItem.aciklama || '');
    const prosedür = cleanText(selectedItem.prosedür || '');
    const kanit = cleanText(selectedItem.kanit || '');
    
    const content = `"Analiz Edilen Madde","İlişkili Rehber","Kontrol Sorusu","Açıklama ve Gerekçe","Denetim Testi","Uygulama Notu"
"${madde}","${rehberRef}","${soru}","${aciklama}","${prosedür}","${kanit}"`;

    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setShowCopyDropdown(false);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const groupedItems = filteredGroupedItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AuditRef</h1>
              <p className="text-slate-600 mt-1">Denetim Referans Aracı</p>
            </div>
            <div className="w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Madde, rehber veya soruda ara..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Panel - Kategoriler */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600">
                <h2 className="text-lg font-semibold text-white">Kategoriler</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {Object.keys(groupedItems).length} ana kategori
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {Object.keys(groupedItems).length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-slate-500">Sonuç bulunamadı</p>
                  </div>
                ) : (
                  Object.keys(groupedItems).map((category) => (
                    <div key={category} className="border-b border-slate-100 last:border-b-0">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(category)}
                          <div className="text-left">
                            <p className="font-medium text-slate-900">{category}</p>
                            <p className="text-xs text-slate-500">
                              {groupedItems[category].length} madde
                            </p>
                          </div>
                        </div>
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                      
                      {expandedCategories.has(category) && (
                        <div className="bg-slate-50 px-4 py-2 space-y-1">
                          {groupedItems[category].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedItem?.id === item.id
                                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              <p className="truncate font-medium">{item.madde}</p>
                              <p className="text-xs text-slate-500 truncate">{item.rehberRef}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Detay */}
          <div className="lg:col-span-2">
            {selectedItem ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{selectedItem.madde}</h3>
                      <p className="text-indigo-100 mt-2">{selectedItem.rehberRef}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                        className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        {copySuccess ? 'Kopyalandı!' : 'Kopyala'}
                        <DropdownIcon className="w-3 h-3" />
                      </button>
                      
                      {showCopyDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                          <button
                            onClick={copySelectedItem}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Metin olarak kopyala
                          </button>
                          <button
                            onClick={copyAsTable}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Tablo olarak kopyala
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 mb-3">Kontrol Sorusu</h4>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700">{selectedItem.soru}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 mb-3">Açıklama ve Gerekçe</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">{selectedItem.aciklama}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 mb-3">Denetim Testi (Prosedür)</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedItem.prosedür}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 mb-3">Uygulama Notu / Örnek Kanıt</h4>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">{selectedItem.kanit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Denetim Madde Seçimi</h3>
                  <p className="text-slate-600">
                    Sol taraftan bir kategori seçip ardından detaylarını görüntülemek istediğiniz maddeye tıklayın.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Geliştirme Zaman Damgası */}
      <div className="fixed bottom-4 left-4 bg-slate-900/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Geliştirme: {buildTimestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Versiyon: v{version}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
