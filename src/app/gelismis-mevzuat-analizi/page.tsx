'use client';

export default function GelismisMevzuatAnalizi() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe 
        src="/mevzuat-analiz.html" 
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          display: 'block'
        }}
        title="Mevzuat Analiz Paneli"
      />
    </div>
  );
}
