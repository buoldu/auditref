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
"[project]/projeler/alleyes/auditref/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$src$2f$lib$2f$audit$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projeler/alleyes/auditref/src/lib/audit-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Home() {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [expandedCategories, setExpandedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copySuccess, setCopySuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [version, setVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('0.1.2');
    // Geliştirme zaman damgası
    const buildTimestamp = new Date().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    // Versiyonu artırma fonksiyonu
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const incrementVersion = ()=>{
            const parts = version.split('.');
            const patch = parseInt(parts[2]) + 1;
            setVersion(`${parts[0]}.${parts[1]}.${patch}`);
        };
        // Her build'te versiyonu artır
        incrementVersion();
    }, []);
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
    const toggleCategory = (category)=>{
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };
    const getGroupedItems = ()=>{
        const grouped = {};
        items.forEach((item)=>{
            // Ana kategoriyi belirle (ilk kelime veya ilk cümle)
            const category = item.madde.split(' ')[0] || item.madde.substring(0, 20);
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(item);
        });
        return grouped;
    };
    const filteredGroupedItems = ()=>{
        const grouped = getGroupedItems();
        const filtered = {};
        Object.keys(grouped).forEach((category)=>{
            if (searchQuery.trim() === '') {
                filtered[category] = grouped[category];
            } else {
                const categoryItems = grouped[category].filter((item)=>item.madde.toLowerCase().includes(searchQuery.toLowerCase()) || item.rehberRef.toLowerCase().includes(searchQuery.toLowerCase()) || item.soru.toLowerCase().includes(searchQuery.toLowerCase()));
                if (categoryItems.length > 0) {
                    filtered[category] = categoryItems;
                }
            }
        });
        return filtered;
    };
    const getCategoryIcon = (category)=>{
        if (category.toLowerCase().includes('alacak') || category.toLowerCase().includes('kredi')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                className: "h-5 w-5 text-indigo-600"
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 103,
                columnNumber: 14
            }, this);
        } else if (category.toLowerCase().includes('denetim') || category.toLowerCase().includes('kontrol')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                className: "h-5 w-5 text-green-600"
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 105,
                columnNumber: 14
            }, this);
        } else if (category.toLowerCase().includes('süreç') || category.toLowerCase().includes('yönetim')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                className: "h-5 w-5 text-blue-600"
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 107,
                columnNumber: 14
            }, this);
        } else {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                className: "h-5 w-5 text-slate-600"
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 109,
                columnNumber: 14
            }, this);
        }
    };
    const copyAsTable = async ()=>{
        if (!selectedItem) return;
        // Excel için en basit format - tab ile ayrılmış, tırnaksız
        const madde = (selectedItem.madde || '').replace(/\t/g, ' ').replace(/\n/g, ' ');
        const rehberRef = (selectedItem.rehberRef || '').replace(/\t/g, ' ').replace(/\n/g, ' ');
        const soru = (selectedItem.soru || '').replace(/\t/g, ' ').replace(/\n/g, ' ');
        const aciklama = (selectedItem.aciklama || '').replace(/\t/g, ' ').replace(/\n/g, ' ');
        const prosedür = (selectedItem.prosedür || '').replace(/\t/g, ' ').replace(/\n/g, ' ');
        const kanit = (selectedItem.kanit || '').replace(/\t/g, ' ').replace(/\n/g, ' ');
        const content = `Analiz Edilen Madde\tİlişkili Rehber\tKontrol Sorusu\tAçıklama ve Gerekçe\tDenetim Testi\tUygulama Notu
${madde}\t${rehberRef}\t${soru}\t${aciklama}\t${prosedür}\t${kanit}`;
        try {
            await navigator.clipboard.writeText(content);
            setCopySuccess(true);
            setTimeout(()=>setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "Yükleniyor..."
                    }, void 0, false, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 139,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this);
    }
    const groupedItems = filteredGroupedItems();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-sm border-b border-slate-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-6 py-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-slate-900",
                                        children: "AuditRef"
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-600 mt-1",
                                        children: "Denetim Referans Aracı"
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-96",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-5 w-5 text-slate-400"
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 161,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            className: "block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white placeholder-slate-500 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                                            placeholder: "Madde, rehber veya soruda ara..."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-6 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-gradient-to-r from-indigo-500 to-indigo-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold text-white",
                                                children: "Kategoriler"
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 184,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-indigo-100 text-sm mt-1",
                                                children: [
                                                    Object.keys(groupedItems).length,
                                                    " ana kategori"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 185,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                        lineNumber: 183,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-96 overflow-y-auto",
                                        children: Object.keys(groupedItems).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-slate-500",
                                                children: "Sonuç bulunamadı"
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 193,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 192,
                                            columnNumber: 19
                                        }, this) : Object.keys(groupedItems).map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-b border-slate-100 last:border-b-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleCategory(category),
                                                        className: "w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center space-x-3",
                                                                children: [
                                                                    getCategoryIcon(category),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-left",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-medium text-slate-900",
                                                                                children: category
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                                lineNumber: 205,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-slate-500",
                                                                                children: [
                                                                                    groupedItems[category].length,
                                                                                    " madde"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                                lineNumber: 206,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                        lineNumber: 204,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                lineNumber: 202,
                                                                columnNumber: 25
                                                            }, this),
                                                            expandedCategories.has(category) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                className: "h-4 w-4 text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                lineNumber: 212,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                className: "h-4 w-4 text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 23
                                                    }, this),
                                                    expandedCategories.has(category) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-slate-50 px-4 py-2 space-y-1",
                                                        children: groupedItems[category].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setSelectedItem(item),
                                                                className: `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedItem?.id === item.id ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "truncate font-medium",
                                                                        children: item.madde
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                        lineNumber: 230,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-slate-500 truncate",
                                                                        children: item.rehberRef
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                        lineNumber: 231,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, item.id, true, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                lineNumber: 221,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, category, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: selectedItem ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 bg-gradient-to-r from-indigo-500 to-indigo-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-xl font-semibold text-white",
                                                            children: selectedItem.madde
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-indigo-100 mt-2",
                                                            children: selectedItem.rehberRef
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: copyAsTable,
                                                        className: "ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                                lineNumber: 258,
                                                                columnNumber: 25
                                                            }, this),
                                                            copySuccess ? 'Kopyalama Başarılı' : 'Kopyala'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 254,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 248,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                        lineNumber: 247,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-medium text-slate-900 mb-3",
                                                        children: "Kontrol Sorusu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-slate-50 rounded-lg p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-slate-700",
                                                            children: selectedItem.soru
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-medium text-slate-900 mb-3",
                                                        children: "Açıklama ve Gerekçe"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-blue-50 rounded-lg p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-slate-700 leading-relaxed",
                                                            children: selectedItem.aciklama
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                            lineNumber: 276,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 273,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-medium text-slate-900 mb-3",
                                                        children: "Denetim Testi (Prosedür)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-green-50 rounded-lg p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-slate-700 leading-relaxed whitespace-pre-line",
                                                            children: selectedItem.prosedür
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 282,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 280,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-lg font-medium text-slate-900 mb-3",
                                                        children: "Uygulama Notu / Örnek Kanıt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 288,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-amber-50 rounded-lg p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-slate-700 leading-relaxed",
                                                            children: selectedItem.kanit
                                                        }, void 0, false, {
                                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                            lineNumber: 290,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 287,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-md mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "h-8 w-8 text-indigo-600"
                                            }, void 0, false, {
                                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                                lineNumber: 299,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 298,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-medium text-slate-900 mb-2",
                                            children: "Denetim Madde Seçimi"
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 301,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-600",
                                            children: "Sol taraftan bir kategori seçip ardından detaylarını görüntülemek istediğiniz maddeye tıklayın."
                                        }, void 0, false, {
                                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                            lineNumber: 302,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                lineNumber: 296,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 left-4 bg-slate-900/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Geliştirme: ",
                                        buildTimestamp
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                            lineNumber: 315,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 bg-blue-400 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$projeler$2f$alleyes$2f$auditref$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Versiyon: v",
                                        version
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                            lineNumber: 319,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                    lineNumber: 314,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/projeler/alleyes/auditref/src/app/page.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f0fe896b._.js.map