import { Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";


export default function RecapPage() {
  // Di dalam DashboardProduction.jsx atau sejenisnya
  const { products = [], orders = [], items = [] } = useOutletContext();
  const [activeTab, setActiveTab] = useState("Semua");
  // 1. Ambil kategori unik secara dinamis
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ["Semua", ...cats];
  }, [products]);

    // 2. Filter & Ringkas Data berdasarkan Kategori yang dipilih
    const productionData = useMemo(() => {
    const summary = {};

    orders.forEach(order => {
        order.items?.forEach(item => {
        // Kita butuh category dari data product asli untuk filtering
        const productInfo = products.find(p => p.id === item.product_id);
        const category = productInfo?.category || "Lainnya";

        if (activeTab === "Semua" || category === activeTab) {
            const key = `${item.product_name} | ${item.variant_name}`;
            if (!summary[key]) {
            summary[key] = { 
                name: item.product_name, 
                variant: item.variant_name, 
                qty: 0,
                category: category
            };
            }
            summary[key].qty += (item.qty || 1);
        }
        });
    });

    return Object.values(summary);
    }, [orders, products, activeTab]);
    return (
        <div className="space-y-6 pb-20">
            {/* --- DYNAMIC TABS (Horizontal Scroll) --- */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
            {categories.map(cat => (
                <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${
                    activeTab === cat 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white text-slate-400 border border-slate-100'
                }`}
                >
                {cat}
                </button>
            ))}
            </div>

            {/* --- PRODUCTION CONTENT --- */}
            <div className="grid grid-cols-1 gap-4">
            {/* Grouping by Product Name */}
            {[...new Set(productionData.map(d => d.name))].map(productName => {
                const variants = productionData.filter(d => d.name === productName);
                const isKaos = variants[0].category.toLowerCase().includes('kaos');

                return (
                <div key={productName} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black text-slate-800 leading-tight">{productName}</h3>
                    <button 
                        onClick={() => handleCopyToVendor(productName, variants)}
                        className="p-2 bg-slate-50 text-emerald-500 rounded-xl hover:bg-emerald-100"
                    >
                        <Share2 size={16} />
                    </button>
                    </div>

                    {/* Layout Berbeda: Kaos pakai Grid, Lainnya pakai List */}
                    {isKaos ? (
                    <div className="grid grid-cols-3 gap-2">
                        {variants.map(v => (
                        <div key={v.variant} className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{v.variant}</p>
                            <p className="text-lg font-black text-slate-800">{v.qty}</p>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="space-y-2">
                        {variants.map(v => (
                        <div key={v.variant} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                            <span className="text-xs font-bold text-slate-600 uppercase">{v.variant}</span>
                            <span className="text-sm font-black text-emerald-500">{v.qty} Pcs</span>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                );
            })}
            </div>
        </div>
        );
}