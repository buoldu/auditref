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
"[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BasitListe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/src/lib/audit-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function BasitListe() {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [expandedItems, setExpandedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [showAdvancedSearch, setShowAdvancedSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        madde: '',
        rehberRef: '',
        soru: '',
        aciklama: '',
        prosedür: '',
        kanit: ''
    });
    const [selectedItems, setSelectedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadData = async ()=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auditDataService"].loadData();
                const allItems = __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auditDataService"].getAllData();
                setItems(allItems);
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            } finally{
                setLoading(false);
            }
        };
        loadData();
    }, []);
    const toggleExpanded = (id)=>{
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };
    const filteredItems = items.filter((item)=>{
        // Genel arama
        const generalMatch = searchQuery.trim() === '' || item.madde.toLowerCase().includes(searchQuery.toLowerCase()) || item.rehberRef.toLowerCase().includes(searchQuery.toLowerCase()) || item.soru.toLowerCase().includes(searchQuery.toLowerCase()) || item.aciklama.toLowerCase().includes(searchQuery.toLowerCase()) || item.prosedür.toLowerCase().includes(searchQuery.toLowerCase()) || item.kanit.toLowerCase().includes(searchQuery.toLowerCase());
        // Detaylı filtreler
        const detailMatch = (filters.madde === '' || item.madde.toLowerCase().includes(filters.madde.toLowerCase())) && (filters.rehberRef === '' || item.rehberRef.toLowerCase().includes(filters.rehberRef.toLowerCase())) && (filters.soru === '' || item.soru.toLowerCase().includes(filters.soru.toLowerCase())) && (filters.aciklama === '' || item.aciklama.toLowerCase().includes(filters.aciklama.toLowerCase())) && (filters.prosedür === '' || item.prosedür.toLowerCase().includes(filters.prosedür.toLowerCase())) && (filters.kanit === '' || item.kanit.toLowerCase().includes(filters.kanit.toLowerCase()));
        return generalMatch && detailMatch;
    });
    const clearFilters = ()=>{
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "Yükleniyor..."
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50 p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-slate-900 mb-2",
                            children: "Gelişmiş Veri Listesi"
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-600",
                            children: "Detaylı arama, filtreleme ve seçme ile verileri keşfedin"
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-5 w-5 text-slate-400"
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    className: "block w-full pl-10 pr-20 py-3 border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                                    placeholder: "Tüm başlıklarda ara..."
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAdvancedSearch(!showAdvancedSearch),
                                    className: "absolute inset-y-0 right-0 px-3 flex items-center text-indigo-600 hover:text-indigo-800",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        showAdvancedSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-4 rounded-lg border border-slate-200 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-slate-700 mb-1",
                                                    children: "Analiz Edilen Madde"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: filters.madde,
                                                    onChange: (e)=>setFilters({
                                                            ...filters,
                                                            madde: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                                    placeholder: "Madde ara..."
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 139,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-slate-700 mb-1",
                                                    children: "Rehber Maddesi"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: filters.rehberRef,
                                                    onChange: (e)=>setFilters({
                                                            ...filters,
                                                            rehberRef: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                                    placeholder: "Rehber ara..."
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 147,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-slate-700 mb-1",
                                                    children: "Kontrol Sorusu"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: filters.soru,
                                                    onChange: (e)=>setFilters({
                                                            ...filters,
                                                            soru: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                                    placeholder: "Soru ara..."
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 157,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-slate-700 mb-1",
                                                    children: "Açıklama"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: filters.aciklama,
                                                    onChange: (e)=>setFilters({
                                                            ...filters,
                                                            aciklama: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                                    placeholder: "Açıklama ara..."
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 167,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-slate-700 mb-1",
                                                    children: "Denetim Testi"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: filters.prosedür,
                                                    onChange: (e)=>setFilters({
                                                            ...filters,
                                                            prosedür: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                                    placeholder: "Prosedür ara..."
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-slate-700 mb-1",
                                                    children: "Uygulama Notu"
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: filters.kanit,
                                                    onChange: (e)=>setFilters({
                                                            ...filters,
                                                            kanit: e.target.value
                                                        }),
                                                    className: "w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                                    placeholder: "Kanıt ara..."
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex justify-between",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: clearFilters,
                                        className: "px-4 py-2 text-sm text-slate-600 hover:text-slate-800",
                                        children: "Temizle"
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                        lineNumber: 199,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-4 rounded-lg border border-slate-200",
                            children: (searchQuery || Object.values(filters).some((f)=>f !== '')) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-600",
                                children: [
                                    filteredItems.length,
                                    " sonuç bulundu"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow p-12 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-500",
                                    children: searchQuery || Object.values(filters).some((f)=>f !== '') ? 'Arama kriterlerinize uygun sonuç bulunamadı.' : 'Gösterilecek veri bulunamadı.'
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 222,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this) : filteredItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg shadow overflow-hidden hover:shadow-lg hover:ring-2 hover:ring-indigo-200 transition-all duration-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start space-x-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 -m-2 p-2 rounded-lg transition-all duration-200",
                                                    onClick: ()=>toggleExpanded(item.id),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-lg font-semibold text-slate-900 mb-2",
                                                                        children: item.madde
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                        lineNumber: 240,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-medium text-slate-700",
                                                                                        children: "Rehber:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                                        lineNumber: 243,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-slate-600",
                                                                                        children: item.rehberRef
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                                        lineNumber: 244,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                                lineNumber: 242,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-medium text-slate-700",
                                                                                        children: "Soru:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                                        lineNumber: 247,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-slate-600",
                                                                                        children: item.soru
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                                        lineNumber: 248,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                                lineNumber: 246,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                        lineNumber: 241,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "ml-4 flex items-center",
                                                                children: expandedItems.has(item.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "h-5 w-5 text-slate-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                    lineNumber: 254,
                                                                    columnNumber: 29
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "h-5 w-5 text-slate-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                    lineNumber: 256,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this),
                                        expandedItems.has(item.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-t border-slate-200 p-4 bg-gradient-to-br from-slate-50 to-indigo-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-medium text-green-800 mb-2",
                                                                children: "Açıklama ve Gerekçe"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 268,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-green-700 leading-relaxed",
                                                                children: item.aciklama
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-medium text-purple-800 mb-2",
                                                                children: "Denetim Testi (Prosedür)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 272,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-purple-700 leading-relaxed whitespace-pre-line",
                                                                children: item.prosedür
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 273,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                        lineNumber: 271,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "lg:col-span-2 bg-gradient-to-r from-rose-50 to-red-50 p-4 rounded-lg border border-rose-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-medium text-rose-800 mb-2",
                                                                children: "Uygulama Notu / Örnek Kanıt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 276,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-rose-700 leading-relaxed",
                                                                children: item.kanit
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                                lineNumber: 277,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                            lineNumber: 265,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                            lineNumber: 219,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
            lineNumber: 105,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/projeler/alleyes/auditref/src/app/basit-liste/page.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__205308a1._.js.map