import Papa from 'papaparse';
import Fuse from 'fuse.js';

export interface AuditItem {
  id: string;
  madde: string;
  rehberRef: string;
  soru: string;
  aciklama: string;
  prosedür: string;
  kanit: string;
}

export interface GroupedAuditItems {
  [madde: string]: AuditItem[];
}

export class AuditDataService {
  private data: AuditItem[] = [];
  private fuse: Fuse<AuditItem>;

  constructor() {
    this.fuse = new Fuse([], {
      keys: ['madde', 'rehberRef', 'soru', 'aciklama', 'prosedür', 'kanit'],
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

      this.data = parseResult.data.map((row: any, index: number) => ({
        id: `audit-${index}`,
        madde: row['Analiz Edilen Madde'] || '',
        rehberRef: row['İlişkili Rehber Maddesi (Yerel / Uluslararası)'] || '',
        soru: row['Kontrol Sorusu'] || '',
        aciklama: row['Açıklama ve Gerekçe'] || '',
        prosedür: row['Denetim Testi (Prosedür)'] || '',
        kanit: row['Uygulama Notu / Örnek Kanıt'] || '',
      })).filter((item: AuditItem) => item.madde.trim() !== '');

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
        madde: 'Alacak Takip Süreci',
        rehberRef: 'TS 5000 Madde 12',
        soru: 'Alacak takip süreci yasal gerekliliklere uygun mu?',
        aciklama: 'Alacak takip süreci, yasal düzenlemelere ve şirket politikalarına uygun olarak yürütülmelidir.',
        prosedür: '• Takip süreçlerinin dokümante edilmesini kontrol et\n• Yasal sürelerin takip edildiğini doğrula\n• Müvekkil onaylarının alındığını kontrol et',
        kanit: 'Takip tutanakları, müvekkil onay formları, süreç haritaları'
      },
      {
        id: 'audit-1',
        madde: 'Müşteri Bilgileri',
        rehberRef: 'KVKK Madde 6',
        soru: 'Müşteri bilgileri gizlilik ilkesine uygun mu?',
        aciklama: 'Müşteri bilgileri, kişisel verilerin korunması kanunu hükümlerine göre korunmalıdır.',
        prosedür: '• Bilgi güvenliği politikalarını kontrol et\n• Yetkilendirme matrisini incele\n• Veri ihbar süreçlerini test et',
        kanit: 'Gizlilik sözleşmeleri, yetkilendirme listeleri, güvenlik raporları'
      },
      {
        id: 'audit-2',
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
      if (!groups[item.madde]) {
        groups[item.madde] = [];
      }
      groups[item.madde].push(item);
      return groups;
    }, {});
  }

  getUniqueMaddeler(): string[] {
    return [...new Set(this.data.map(item => item.madde))];
  }

  search(query: string): AuditItem[] {
    if (!query.trim()) return this.getAllData();

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  getItemsByMadde(madde: string): AuditItem[] {
    return this.data.filter(item => item.madde === madde);
  }

  getItemById(id: string): AuditItem | undefined {
    return this.data.find(item => item.id === id);
  }
}

export const auditDataService = new AuditDataService();
