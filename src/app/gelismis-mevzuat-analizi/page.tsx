'use client';

export default function GelismisMevzuatAnalizi() {
  return (
    <div className="w-full -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="relative" style={{ height: 'calc(100vh - 120px)' }}>
        <iframe 
          src="/mevzuat-analiz.html" 
          className="w-full h-full border-0 block"
          title="Mevzuat Analiz Paneli"
        />
      </div>
    </div>
  );
}
