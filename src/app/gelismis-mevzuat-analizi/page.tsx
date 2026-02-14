'use client';

export default function GelismisMevzuatAnalizi() {
  return (
    <div className="fixed top-14 left-0 right-0 bottom-0 z-20 bg-[#f5f7fa] dark:bg-[#0f172a]">
      <iframe 
        src="/mevzuat-analiz.html" 
        className="w-full h-full border-0 block"
        title="Mevzuat Analiz Paneli"
      />
    </div>
  );
}
