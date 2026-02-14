'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, FileText, Building2, Shield, BookOpen, Scale, Users, AlertCircle, TrendingUp, FileCheck, Archive } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function KategorilerPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
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
      const mevzuat = item.mevzuat || 'Diğer';
      if (!grouped[mevzuat]) {
        grouped[mevzuat] = [];
      }
      grouped[mevzuat].push(item);
    });

    return grouped;
  };

  const filteredGroupedItems = () => {
    const grouped = getGroupedItems();
    const filtered: { [key: string]: AuditItem[] } = {};

    Object.keys(grouped).forEach(mevzuat => {
      if (searchQuery.trim() === '') {
        filtered[mevzuat] = grouped[mevzuat];
      } else {
        const mevzuatItems = grouped[mevzuat].filter(item =>
          item.mevzuat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.madde.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.rehberRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.soru.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (mevzuatItems.length > 0) {
          filtered[mevzuat] = mevzuatItems;
        }
      }
    });

    return filtered;
  };

  const getCategoryIcon = (mevzuat: string) => {
    const iconClass = "h-5 w-5";
    
    if (mevzuat.toLowerCase().includes('banka') || mevzuat.toLowerCase().includes('kart')) {
      return <Building2 className={`${iconClass} text-indigo-600`} />;
    } else if (mevzuat.toLowerCase().includes('sistem') || mevzuat.toLowerCase().includes('sermaye')) {
      return <Shield className={`${iconClass} text-green-600`} />;
    } else if (mevzuat.toLowerCase().includes('faizsiz') || mevzuat.toLowerCase().includes('teblig')) {
      return <BookOpen className={`${iconClass} text-blue-600`} />;
    } else if (mevzuat.toLowerCase().includes('finansal') || mevzuat.toLowerCase().includes('borc')) {
      return <TrendingUp className={`${iconClass} text-purple-600`} />;
    } else if (mevzuat.toLowerCase().includes('kredi') || mevzuat.toLowerCase().includes('rehber')) {
      return <FileCheck className={`${iconClass} text-orange-600`} />;
    } else if (mevzuat.toLowerCase().includes('sorunlu') || mevzuat.toLowerCase().includes('alacak')) {
      return <AlertCircle className={`${iconClass} text-red-600`} />;
    } else if (mevzuat.toLowerCase().includes('yönetmelik')) {
      return <Scale className={`${iconClass} text-teal-600`} />;
    } else if (mevzuat.toLowerCase().includes('kanun')) {
      return <Users className={`${iconClass} text-cyan-600`} />;
    } else {
      return <Archive className={`${iconClass} text-slate-600`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const groupedItems = filteredGroupedItems();

  return (
    <div className="space-y-3">
      {/* Başlık */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kategoriler</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mevzuat kategorilerine göre düzenlenmiş denetim maddeleri
        </p>
      </div>

      {/* Ana İçerik */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sol Panel - Kategoriler */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium mb-2">
                Kategoriler ({Object.keys(groupedItems).length})
              </CardTitle>
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ara..."
                className="h-8 text-sm"
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {Object.keys(groupedItems).length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400">Sonuç bulunamadı</p>
                  </div>
                ) : (
                  Object.keys(groupedItems).map((mevzuat) => (
                    <div key={mevzuat} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                      <button
                        onClick={() => toggleCategory(mevzuat)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(mevzuat)}
                          <div className="text-left">
                            <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                              {mevzuat}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {groupedItems[mevzuat].length} madde
                            </p>
                          </div>
                        </div>
                        {expandedCategories.has(mevzuat) ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                      
                      {expandedCategories.has(mevzuat) && (
                        <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-2 space-y-1">
                          {groupedItems[mevzuat].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedItem?.id === item.id
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                              }`}
                            >
                              <p className="truncate font-medium">{item.madde}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {item.rehberRef}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Panel - Detay */}
        <div className="lg:col-span-3">
          {selectedItem ? (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{selectedItem.madde}</CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {selectedItem.mevzuat}
                    </Badge>
                  </div>
                  <p className="text-blue-100">{selectedItem.rehberRef}</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Kontrol Sorusu
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-700 dark:text-slate-300">{selectedItem.soru}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Açıklama ve Gerekçe
                  </h4>
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedItem.aciklama}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Denetim Testi (Prosedür)
                  </h4>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {selectedItem.prosedür}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Uygulama Notu / Örnek Kanıt
                  </h4>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedItem.kanit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center py-24">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Denetim Maddesi Seçimi
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Sol taraftan bir kategori seçip ardından detaylarını görüntülemek istediğiniz maddeye tıklayın.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
