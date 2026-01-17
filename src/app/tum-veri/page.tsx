'use client';

import { useState, useEffect } from 'react';
import { Search, Copy } from 'lucide-react';
import { AuditItem, auditDataService } from '@/lib/audit-data';

export default function TumVeriPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const searchResults = auditDataService.search(searchQuery);
      setFilteredItems(searchResults);
    }
  }, [searchQuery, items]);

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tüm Denetim Verileri</h1>
          <p className="text-slate-600">Tüm denetim maddelerini ve detaylarını görüntüleyin</p>
        </div>

        {/* Arama Barı */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Tüm dokümanlarda ara..."
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-slate-600">
              {filteredItems.length} sonuç bulundu
            </p>
          )}
        </div>

        {/* Tablo */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {searchQuery && filteredItems.length > 0 && (
            <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
              <span className="text-sm text-indigo-700 font-medium">
                {filteredItems.length} arama sonucu
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                {copySuccess ? 'Kopyalandı!' : 'Sonuçları Kopyala'}
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Analiz Edilen Madde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    İlişkili Rehber Maddesi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kontrol Sorusu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Açıklama ve Gerekçe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Denetim Testi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Uygulama Notu
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
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.madde}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.rehberRef}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.soru}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="max-w-xs truncate" title={item.aciklama}>
                          {item.aciklama}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="max-w-xs truncate" title={item.prosedür}>
                          {item.prosedür}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="max-w-xs truncate" title={item.kanit}>
                          {item.kanit}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
