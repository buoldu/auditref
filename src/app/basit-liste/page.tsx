'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchFilters {
  madde: string;
  rehberRef: string;
  soru: string;
  aciklama: string;
  prosedür: string;
  kanit: string;
}

export default function BasitListePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    }>
      <BasitListe />
    </Suspense>
  );
}

function BasitListe() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Başlık */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gelişmiş Veri Listesi</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Detaylı arama, filtreleme ve seçme</p>
      </div>

      {/* Arama Barı */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-24 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          placeholder="Tüm başlıklarda ara..."
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          Filtreler
        </Button>
      </div>

      {/* Gelişmiş Arama */}
      {showAdvancedSearch && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Gelişmiş Filtreler</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedSearch(false)}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Madde</label>
              <Input type="text" value={filters.madde} onChange={(e) => setFilters({...filters, madde: e.target.value})} placeholder="Ara..." className="h-8 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Rehber</label>
              <Input type="text" value={filters.rehberRef} onChange={(e) => setFilters({...filters, rehberRef: e.target.value})} placeholder="Ara..." className="h-8 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Soru</label>
              <Input type="text" value={filters.soru} onChange={(e) => setFilters({...filters, soru: e.target.value})} placeholder="Ara..." className="h-8 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Açıklama</label>
              <Input type="text" value={filters.aciklama} onChange={(e) => setFilters({...filters, aciklama: e.target.value})} placeholder="Ara..." className="h-8 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Prosedür</label>
              <Input type="text" value={filters.prosedür} onChange={(e) => setFilters({...filters, prosedür: e.target.value})} placeholder="Ara..." className="h-8 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Kanıt</label>
              <Input type="text" value={filters.kanit} onChange={(e) => setFilters({...filters, kanit: e.target.value})} placeholder="Ara..." className="h-8 text-xs" />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters} className="h-7 text-xs">
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      )}

      {/* Sonuç Sayısı */}
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-slate-100">{filteredItems.length}</span> sonuç bulundu
          </p>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                {(searchQuery || Object.values(filters).some(f => f !== '')) 
                  ? 'Arama kriterlerinize uygun sonuç bulunamadı.' 
                  : 'Gösterilecek veri bulunamadı.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader 
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-start gap-2">
                      <CardTitle className="text-base sm:text-lg break-words">{item.madde}</CardTitle>
                      <Badge variant="outline" className="flex-shrink-0 text-xs">
                        {item.mevzuat}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="min-w-0">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Rehber:</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 break-words">{item.rehberRef}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Soru:</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 break-words">{item.soru}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedItems.has(item.id) && (
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Açıklama ve Gerekçe</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{item.aciklama}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Denetim Testi (Prosedür)</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed whitespace-pre-line">{item.prosedür}</p>
                    </div>
                    <div className="lg:col-span-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Uygulama Notu / Örnek Kanıt</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{item.kanit}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
