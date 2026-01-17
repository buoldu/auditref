# AuditRef - Denetim Referans Aracı

Profesyonel bir Denetim Referans Aracı (Audit Reference Tool) olan AuditRef, "Sorunlu Alacak Çözümleme Rehberi"ni interaktif bir iş istasyonuna dönüştürür.

## Özellikler

- ✅ **Master-Detail Layout**: Bölünmüş görünüm ile verimli çalışma
- ✅ **Gelişmiş Arama**: Fuse.js ile anlık filtreleme
- ✅ **CSV Veri Desteği**: Kolay veri içe/dışa aktarma
- ✅ **Kurumsal Tasarım**: Slate/Indigo renk paleti
- ✅ **Responsive**: Tüm cihazlarda mükemmel görünüm

## Teknolojiler

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PapaParse** (CSV işleme)
- **Fuse.js** (gelişmiş arama)
- **Lucide React** (ikonlar)

## Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd auditref

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Veri Yapısı

CSV dosyası şu sütunları içermelidir:
- `Analiz Edilen Madde`
- `İlişkili Rehber Maddesi (Yerel / Uluslararası)`
- `Kontrol Sorusu`
- `Açıklama ve Gerekçe`
- `Denetim Testi (Prosedür)`
- `Uygulama Notu / Örnek Kanıt`

## Kullanım

1. CSV dosyanızı `public/data/all.csv` olarak ekleyin
2. `npm run dev` ile sunucuyu başlatın
3. http://localhost:3000 adresini açın

## Build ve Deploy

```bash
# Production build
npm run build

# Statik sunucu ile test
npm run start

# Vercel deploy
npx vercel --prod
```

## Lisans

MIT License
