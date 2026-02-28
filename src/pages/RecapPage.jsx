import { Share2, ClipboardCheck, Package2, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function RecapPage() {
  const { products = [], orderItems = [] } = useOutletContext();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Semua");

  // 1. Get Unique Categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ["Semua", ...cats];
  }, [products]);

  // 2. Production Summary Logic
  const productionData = useMemo(() => {
    const summary = {};
    orderItems.forEach(item => {
      const productInfo = products.find(p => p.id === item.product_id);
      const category = productInfo?.category || "Lainnya";
      const variantName = productInfo?.variants?.find(v => v.id === item.variant_id)?.name || "Default";

      if (activeTab === "Semua" || category === activeTab) {
        const key = `${item.product_name} | ${variantName}`;
        if (!summary[key]) {
          summary[key] = { 
            name: productInfo?.name || item.product_name, 
            variant: variantName, 
            qty: 0,
            category: category,
            total_orders: 0
          };
        }
        summary[key].qty += (item.qty || 1);
        summary[key].total_orders += 1;
      }
    });
    return Object.values(summary);
  }, [orderItems, products, activeTab]);

  // 3. Share Functionality
  const handleCopyToVendor = (productName, variants) => {
    const text = `*REKAP PRODUKSI: ${productName.toUpperCase()}*\n` + 
      variants.map(v => `- ${v.variant}: ${v.qty} pcs`).join('\n') +
      `\n\nTotal: ${variants.reduce((sum, v) => sum + v.qty, 0)} pcs`;
    
    navigator.clipboard.writeText(text);
    showToast("Rekap berhasil disalin ke clipboard!", "success");
  };

  const productNames = [...new Set(productionData.map(d => d.name))];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rekap Produksi</h1>
          <p className="text-slate-500 font-light italic">Total barang yang harus disiapkan</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
          <Info className="w-4 h-4 text-blue-500" />
          <p className="text-[10px] font-bold text-blue-700 uppercase leading-none">
            Total {productionData.reduce((sum, item) => sum + item.qty, 0)} Pcs Terdeteksi
          </p>
        </div>
      </div>

      {/* DYNAMIC TABS (Sticky & Glassmorphism) */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-slate-50/80 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto no-scrollbar p-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap active:scale-95 ${
                activeTab === cat 
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-2' 
                : 'bg-white text-slate-400 border border-slate-200 hover:border-emerald-300 hover:text-emerald-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTION CONTENT */}
      {productNames.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <Package2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Tidak ada antrean produksi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productNames.map(productName => {
            const variants = productionData.filter(d => d.name === productName);
            const totalQty = variants.reduce((sum, v) => sum + v.qty, 0);
            const isKaos = variants[0].category.toLowerCase().includes('kaos');

            return (
              <div key={productName} className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-2xl transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[80%]">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                      {variants[0].category}
                    </span>
                    <h3 className="text-lg font-black text-slate-800 mt-2 leading-tight group-hover:text-emerald-600 transition-colors">
                      {productName}
                    </h3>
                  </div>
                  <button 
                    onClick={() => handleCopyToVendor(productName, variants)}
                    className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:rotate-12"
                    title="Copy for Vendor"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                <div className="flex-1">
                  {isKaos ? (
                    <div className="grid grid-cols-3 gap-2">
                      {variants.map(v => (
                        <div key={v.variant} className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all">
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{v.variant}</p>
                          <p className="text-xl font-black text-slate-800">{v.qty}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {variants.map(v => (
                        <div key={v.variant} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                          <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{v.variant}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-emerald-600">{v.qty}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Pcs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-2 text-slate-400">
                      <ClipboardCheck size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Total Produksi</span>
                   </div>
                   <span className="text-lg font-black text-slate-800">{totalQty} <small className="text-[10px] font-bold text-slate-400">PCS</small></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}