import Papa from 'papaparse';
import Fuse from 'fuse.js';

export interface AuditItem {
  id: string;
  mevzuat: string;
  madde: string;
  rehberRef: string;
  soru: string;
  aciklama: string;
  prosedür: string;
  kanit: string;
}

export interface GroupedAuditItems {
  [mevzuat: string]: AuditItem[];
}

export class AuditDataService {
  private data: AuditItem[] = [];
  private fuse: Fuse<AuditItem>;

  constructor() {
    this.fuse = new Fuse([], {
      keys: ['mevzuat', 'madde', 'rehberRef', 'soru', 'aciklama', 'prosedür', 'kanit'],
      threshold: 0.4, // Make search a bit more fuzzy
      includeScore: true,
      ignoreLocation: true, // Search the entire string
    });
  }

  async loadData(): Promise<void> {
    try {
      const response = await fetch('/data/all.csv');
      if (!response.ok) {
        console.log('CSV dosyası bulunamadı, örnek veriler kullanılacak');
        this.loadSampleData();
        return;
      }
      const csvText = await response.text();
      
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      // Veriyi parça parça işle
      const rawData = parseResult.data;
      const batchSize = 100;
      const processedData: AuditItem[] = [];

      for (let i = 0; i < rawData.length; i += batchSize) {
        const batch = rawData.slice(i, i + batchSize);
        const batchData = batch.map((row: any, index: number) => ({
          id: `audit-${i + index}`,
          mevzuat: row['Mevuzat'] || '',
          madde: row['Analiz Edilen Madde'] || row['Analiz Edilen Madde (Yönetmelik Metni)'] || '',
          rehberRef: row['İlişkili Rehber Maddesi (Yerel / Uluslararası)'] || '',
          soru: row['Kontrol Sorusu'] || '',
          aciklama: row['Açıklama ve Gerekçe'] || '',
          prosedür: row['Denetim Testi (Prosedür)'] || '',
          kanit: row['Uygulama Notu / Örnek Kanıt'] || '',
        })).filter((item: any) => item.madde.trim() !== '');
        
        processedData.push(...batchData);
        
        // Küçük bir gecikme ile UI'ı bloklamamak için
        if (i % (batchSize * 5) === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      this.data = processedData;
      this.fuse.setCollection(this.data);
    } catch (error) {
      console.error('CSV yüklenemedi, örnek veriler kullanılıyor:', error);
      this.loadSampleData();
    }
  }

  private loadSampleData(): void {
    this.data = [
      {
        id: 'audit-0',
        mevzuat: 'Örnek Mevzuat',
        madde: 'Alacak Takip Süreci',
        rehberRef: 'TS 5000 Madde 12',
        soru: 'Alacak takip süreci yasal gerekliliklere uygun mu?',
        aciklama: 'Alacak takip süreci, yasal düzenlemelere ve şirket politikalarına uygun olarak yürütülmelidir.',
        prosedür: '• Takip süreçlerinin dokümante edilmesini kontrol et\n• Yasal sürelerin takip edildiğini doğrula\n• Müvekkil onaylarının alındığını kontrol et',
        kanit: 'Takip tutanakları, müvekkil onay formları, süreç haritaları'
      },
      {
        id: 'audit-1',
        mevzuat: 'Örnek Mevzuat',
        madde: 'Müşteri Bilgileri',
        rehberRef: 'KVKK Madde 6',
        soru: 'Müşteri bilgileri gizlilik ilkesine uygun mu?',
        aciklama: 'Müşteri bilgileri, kişisel verilerin korunması kanunu hükümlerine göre korunmalıdır.',
        prosedür: '• Bilgi güvenliği politikalarını kontrol et\n• Yetkilendirme matrisini incele\n• Veri ihbar süreçlerini test et',
        kanit: 'Gizlilik sözleşmeleri, yetkilendirme listeleri, güvenlik raporları'
      },
      {
        id: 'audit-2',
        mevzuat: 'Örnek Mevzuat',
        madde: 'Sözleşme Yönetimi',
        rehberRef: 'Borçlar Kanunu Madde 125',
        soru: 'Sözleşmeler yasal gerekliliklere uygun mu?',
        aciklama: 'Tüm sözleşmeler, borçlar kanunu ve ilgili mevzuata uygun olarak hazırlanmalıdır.',
        prosedür: '• Sözleşme şablonlarını incele\n• Hukuki incelemeleri kontrol et\n• İmza yetkilerini doğrula',
        kanit: 'Sözleşme taslakları, hukiki görüşler, imza sirküleri'
      }
    ];
    this.fuse.setCollection(this.data);
  }

  getAllData(): AuditItem[] {
    return this.data;
  }

  getGroupedData(): GroupedAuditItems {
    return this.data.reduce((groups: GroupedAuditItems, item) => {
      if (!groups[item.mevzuat]) {
        groups[item.mevzuat] = [];
      }
      groups[item.mevzuat].push(item);
      return groups;
    }, {});
  }

  getUniqueMevzuat(): string[] {
    return [...new Set(this.data.map(item => item.mevzuat))];
  }

  search(query: string): AuditItem[] {
    if (!query.trim()) return this.getAllData();

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  getItemsByMevzuat(mevzuat: string): AuditItem[] {
    return this.data.filter(item => item.mevzuat === mevzuat);
  }

  getItemById(id: string): AuditItem | undefined {
    return this.data.find(item => item.id === id);
  }
}

export const auditDataService = new AuditDataService();
