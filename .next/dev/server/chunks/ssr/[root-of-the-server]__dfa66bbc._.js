module.exports = [
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/projeler/alleyes/auditref/src/lib/audit-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuditDataService",
    ()=>AuditDataService,
    "auditDataService",
    ()=>auditDataService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$papaparse$2f$papaparse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/papaparse/papaparse.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
;
;
class AuditDataService {
    data = [];
    fuse;
    constructor(){
        this.fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]([], {
            keys: [
                'madde',
                'rehberRef',
                'soru',
                'aciklama',
                'prosedür',
                'kanit'
            ],
            threshold: 0.4,
            includeScore: true,
            ignoreLocation: true
        });
    }
    async loadData() {
        try {
            const response = await fetch('/data/all.csv');
            if (!response.ok) {
                console.log('CSV dosyası bulunamadı, örnek veriler kullanılacak');
                this.loadSampleData();
                return;
            }
            const csvText = await response.text();
            const parseResult = __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$papaparse$2f$papaparse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].parse(csvText, {
                header: true,
                skipEmptyLines: true
            });
            this.data = parseResult.data.map((row, index)=>({
                    id: `audit-${index}`,
                    madde: row['Analiz Edilen Madde'] || '',
                    rehberRef: row['İlişkili Rehber Maddesi (Yerel / Uluslararası)'] || '',
                    soru: row['Kontrol Sorusu'] || '',
                    aciklama: row['Açıklama ve Gerekçe'] || '',
                    prosedür: row['Denetim Testi (Prosedür)'] || '',
                    kanit: row['Uygulama Notu / Örnek Kanıt'] || ''
                })).filter((item)=>item.madde.trim() !== '');
            this.fuse.setCollection(this.data);
        } catch (error) {
            console.error('CSV yüklenemedi, örnek veriler kullanılıyor:', error);
            this.loadSampleData();
        }
    }
    loadSampleData() {
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
    getAllData() {
        return this.data;
    }
    getGroupedData() {
        return this.data.reduce((groups, item)=>{
            if (!groups[item.madde]) {
                groups[item.madde] = [];
            }
            groups[item.madde].push(item);
            return groups;
        }, {});
    }
    getUniqueMaddeler() {
        return [
            ...new Set(this.data.map((item)=>item.madde))
        ];
    }
    search(query) {
        if (!query.trim()) return this.getAllData();
        const results = this.fuse.search(query);
        return results.map((result)=>result.item);
    }
    getItemsByMadde(madde) {
        return this.data.filter((item)=>item.madde === madde);
    }
    getItemById(id) {
        return this.data.find((item)=>item.id === id);
    }
}
const auditDataService = new AuditDataService();
}),
"[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TumVeri2Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-ssr] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/src/lib/audit-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const sortedData = (items, sortConfig)=>{
    if (!sortConfig.key) return items;
    return [
        ...items
    ].sort((a, b)=>{
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};
const EnhancedTable = ({ children })=>{
    const [scrollContainer, setScrollContainer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scrollContent, setScrollContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const style = document.createElement('style');
        style.textContent = `
      .enhanced-scrollbar::-webkit-scrollbar {
        height: 12px !important;
        width: 12px !important;
      }
      .enhanced-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9 !important;
        border-radius: 6px !important;
      }
      .enhanced-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1 !important;
        border-radius: 6px !important;
        border: 2px solid #f1f5f9 !important;
      }
      .enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8 !important;
      }
      .cell-scrollbar::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
      }
      .cell-scrollbar::-webkit-scrollbar-track {
        background: #f8fafc !important;
        border-radius: 4px !important;
      }
      .cell-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1 !important;
        border-radius: 4px !important;
        border: 1px solid #f8fafc !important;
      }
      .cell-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8 !important;
      }
      .cell-scrollbar {
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e1 #f8fafc !important;
      }
    `;
        document.head.appendChild(style);
        return ()=>{
            document.head.removeChild(style);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-lg shadow overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "enhanced-scrollbar overflow-x-auto overflow-y-visible border border-slate-200 rounded-lg",
            children: children
        }, void 0, false, {
            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function TumVeri2Page() {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredItems, setFilteredItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [copySuccess, setCopySuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedItems, setSelectedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [columnFilters, setColumnFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        madde: '',
        rehberRef: '',
        soru: '',
        aciklama: '',
        prosedür: '',
        kanit: ''
    });
    const [sortConfig, setSortConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        key: null,
        direction: 'asc'
    });
    const tableRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sliderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [startX, setStartX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [initialScrollLeft, setInitialScrollLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const copyToClipboard = async ()=>{
        const selectedData = filteredItems.filter((item)=>selectedItems.has(item.id));
        if (selectedData.length === 0) {
            // Hiç seçim yoksa uyarı ver
            alert('Lütfen kopyalamak için en az bir madde seçin.');
            return;
        }
        // Debug: konsola yazdır
        console.log('Toplam filtrelenmiş:', filteredItems.length);
        console.log('Seçili maddeler:', selectedData.length);
        // Sadece seçili maddeleri kopyala
        let content = 'Analiz Edilen Madde\tİlişkili Rehber\tKontrol Sorusu\tAçıklama ve Gerekçe\tDenetim Testi\tUygulama Notu\n';
        selectedData.forEach((item)=>{
            const madde = (item.madde || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
            const rehberRef = (item.rehberRef || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
            const soru = (item.soru || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
            const aciklama = (item.aciklama || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
            const prosedür = (item.prosedür || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
            const kanit = (item.kanit || '').replace(/\n/g, ' ').replace(/\t/g, ' ');
            content += `${madde}\t${rehberRef}\t${soru}\t${aciklama}\t${prosedür}\t${kanit}\n`;
        });
        try {
            await navigator.clipboard.writeText(content);
            setCopySuccess(true);
            setTimeout(()=>setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    };
    const toggleSelection = (id)=>{
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };
    const toggleSelectAll = ()=>{
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredItems.map((item)=>item.id)));
        }
    };
    const handleColumnFilter = (column, value)=>{
        setColumnFilters((prev)=>({
                ...prev,
                [column]: value
            }));
    };
    const handleSort = (key)=>{
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({
            key,
            direction
        });
    };
    const handleMouseDown = (e)=>{
        if (!tableRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - tableRef.current.offsetLeft);
        setInitialScrollLeft(tableRef.current.scrollLeft);
        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };
    const handleMouseMove = (e)=>{
        if (!isDragging || !tableRef.current) return;
        e.preventDefault();
        const x = e.pageX - tableRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        tableRef.current.scrollLeft = initialScrollLeft - walk;
    };
    const handleMouseUp = ()=>{
        setIsDragging(false);
        // Restore text selection
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return ()=>{
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [
        isDragging,
        startX,
        initialScrollLeft
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadData = async ()=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auditDataService"].loadData();
                const allItems = __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auditDataService"].getAllData();
                setItems(allItems);
                setFilteredItems(allItems);
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            } finally{
                setLoading(false);
            }
        };
        loadData();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let filtered = items;
        // Genel arama
        if (searchQuery.trim() !== '') {
            filtered = __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auditDataService"].search(searchQuery);
        }
        // Kolon bazlı filtreler
        filtered = filtered.filter((item)=>{
            return (columnFilters.madde === '' || item.madde.toLowerCase().includes(columnFilters.madde.toLowerCase())) && (columnFilters.rehberRef === '' || item.rehberRef.toLowerCase().includes(columnFilters.rehberRef.toLowerCase())) && (columnFilters.soru === '' || item.soru.toLowerCase().includes(columnFilters.soru.toLowerCase())) && (columnFilters.aciklama === '' || item.aciklama.toLowerCase().includes(columnFilters.aciklama.toLowerCase())) && (columnFilters.prosedür === '' || item.prosedür.toLowerCase().includes(columnFilters.prosedür.toLowerCase())) && (columnFilters.kanit === '' || item.kanit.toLowerCase().includes(columnFilters.kanit.toLowerCase()));
        });
        // Sıralama uygula
        const sortedFiltered = sortedData(filtered, sortConfig);
        setFilteredItems(sortedFiltered);
    }, [
        searchQuery,
        items,
        columnFilters,
        sortConfig
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                        lineNumber: 263,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "Yükleniyor..."
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                lineNumber: 262,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
            lineNumber: 261,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 sm:mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl sm:text-3xl font-bold text-slate-900 mb-2",
                            children: "Tüm Denetim Verileri 2"
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm sm:text-base text-slate-600",
                            children: "Gelişmiş tablo görünümü ve sıralama özellikleri"
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                    lineNumber: 274,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-4 w-4 sm:h-5 sm:w-5 text-slate-400"
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            className: "block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                                            placeholder: "Tüm dokümanlarda ara..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 286,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-slate-600",
                                            children: [
                                                filteredItems.length,
                                                " sonuç bulundu",
                                                selectedItems.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 text-indigo-600 font-medium",
                                                    children: [
                                                        "(",
                                                        selectedItems.size,
                                                        " seçili)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 15
                                        }, this),
                                        filteredItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: copyToClipboard,
                                            className: "ml-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 19
                                                }, this),
                                                copySuccess ? 'Kopyalandı!' : selectedItems.size > 0 ? `${selectedItems.size} Maddeleri Kopyala` : 'Seçimleri Kopyala'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 304,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-700 mb-1",
                                            children: "Madde"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 318,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: columnFilters.madde,
                                            onChange: (e)=>handleColumnFilter('madde', e.target.value),
                                            className: "w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            placeholder: "Filtrele..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-700 mb-1",
                                            children: "Rehber"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 328,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: columnFilters.rehberRef,
                                            onChange: (e)=>handleColumnFilter('rehberRef', e.target.value),
                                            className: "w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            placeholder: "Filtrele..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 329,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 327,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-700 mb-1",
                                            children: "Soru"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 338,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: columnFilters.soru,
                                            onChange: (e)=>handleColumnFilter('soru', e.target.value),
                                            className: "w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            placeholder: "Filtrele..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 339,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-700 mb-1",
                                            children: "Açıklama"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 348,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: columnFilters.aciklama,
                                            onChange: (e)=>handleColumnFilter('aciklama', e.target.value),
                                            className: "w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            placeholder: "Filtrele..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-700 mb-1",
                                            children: "Prosedür"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 358,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: columnFilters.prosedür,
                                            onChange: (e)=>handleColumnFilter('prosedür', e.target.value),
                                            className: "w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            placeholder: "Filtrele..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 359,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 357,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-700 mb-1",
                                            children: "Kanıt"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 368,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: columnFilters.kanit,
                                            onChange: (e)=>handleColumnFilter('kanit', e.target.value),
                                            className: "w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                            placeholder: "Filtrele..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 369,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 367,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EnhancedTable, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: tableRef,
                        className: "enhanced-scrollbar overflow-x-auto overflow-y-visible border border-slate-200 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "min-w-full divide-y divide-slate-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-b border-slate-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[5%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedItems.size === filteredItems.length && filteredItems.length > 0,
                                                            onChange: toggleSelectAll,
                                                            className: "h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 388,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Seç"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 387,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[18%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Analiz Edilen Madde"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('madde'),
                                                            className: "p-1 hover:bg-slate-200 rounded transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                                lineNumber: 404,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 397,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[13%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "İlişkili Rehber"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 410,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('rehberRef'),
                                                            className: "p-1 hover:bg-slate-200 rounded transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 408,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[18%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Kontrol Sorusu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('soru'),
                                                            className: "p-1 hover:bg-slate-200 rounded transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 422,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[18%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Açıklama ve Gerekçe"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 432,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('aciklama'),
                                                            className: "p-1 hover:bg-slate-200 rounded transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                                lineNumber: 437,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 433,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 430,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[14%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Denetim Testi"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 443,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('prosedür'),
                                                            className: "p-1 hover:bg-slate-200 rounded transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                                lineNumber: 448,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 444,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 441,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-[14%]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Uygulama Notu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 454,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSort('kanit'),
                                                            className: "p-1 hover:bg-slate-200 rounded transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                lineNumber: 452,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 384,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "bg-white divide-y divide-slate-200",
                                    children: filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 7,
                                            className: "px-6 py-12 text-center text-slate-500",
                                            children: searchQuery ? 'Arama kriterlerinize uygun sonuç bulunamadı.' : 'Gösterilecek veri bulunamadı.'
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 468,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                        lineNumber: 467,
                                        columnNumber: 17
                                    }, this) : filteredItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: `hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50 transition-all duration-200 align-top ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm text-slate-600 align-middle border-r border-slate-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: selectedItems.has(item.id),
                                                        onChange: ()=>toggleSelection(item.id),
                                                        className: "h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm font-medium text-slate-900 align-top border-r border-slate-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-24 overflow-y-auto cell-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words leading-tight text-sm",
                                                            children: item.madde
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 486,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm text-slate-600 align-top border-r border-slate-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-24 overflow-y-auto cell-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words leading-tight text-sm",
                                                            children: item.rehberRef
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 494,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 493,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm text-slate-600 align-top border-r border-slate-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-24 overflow-y-auto cell-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words leading-tight text-sm",
                                                            children: item.soru
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 500,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 499,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm text-slate-600 align-top border-r border-slate-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-32 overflow-y-auto cell-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words leading-tight text-sm",
                                                            children: item.aciklama
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 506,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm text-slate-600 align-top border-r border-slate-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-24 overflow-y-auto cell-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words leading-tight text-sm",
                                                            children: item.prosedür
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 514,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-sm text-slate-600 align-top",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-24 overflow-y-auto cell-scrollbar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words leading-tight text-sm",
                                                            children: item.kanit
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                            lineNumber: 522,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                        lineNumber: 521,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                            lineNumber: 474,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                                    lineNumber: 465,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                            lineNumber: 383,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
                    lineNumber: 381,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
            lineNumber: 272,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/projeler/alleyes/auditref/src/app/tum-veri-2/page.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dfa66bbc._.js.map