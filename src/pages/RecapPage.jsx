import { Share2, Package2, Info, Table as TableIcon } from "lucide-react";
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
    return ["Semua", ...cats, "TABEL"]; // Tambahkan TABEL sebagai opsi tab
  }, [products]);

  // 2. Base Production Logic (untuk Grid View)
  const productionData = useMemo(() => {
    const summary = {};
    orderItems.forEach(item => {
      const productInfo = products.find(p => p.id === item.product_id);
      const category = productInfo?.category;
      const variantName = productInfo?.variants?.find(v => v.id === item.variant_id)?.name;

      if (activeTab === "Semua" || activeTab === "TABEL" || category === activeTab) {
        const key = `${item.product_id}-${item.variant_id}`;
        if (!summary[key]) {
          summary[key] = { 
            name: productInfo?.name, 
            variant: variantName, 
            qty: 0,
            category: category,
          };
        }
        summary[key].qty += (item.qty || 1);
      }
    });
    return Object.values(summary);
  }, [orderItems, products, activeTab]);

  // 3. Logic Khusus untuk Tab Tabel (Pivot Data)
  const tableDataByCategory = useMemo(() => {
    const grouped = {};
    
    // Kelompokkan data berdasarkan Kategori -> Nama Produk -> Varian
    productionData.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = {};
      if (!grouped[item.category][item.name]) grouped[item.category][item.name] = {};
      
      grouped[item.category][item.name][item.variant] = item.qty;
    });

    return grouped;
  }, [productionData]);

  const handleCopyToVendor = (productName, variants) => {
    const text = `*REKAP PRODUKSI: ${productName.toUpperCase()}*\n` + 
      variants.map(v => `- ${v.variant}: ${v.qty} pcs`).join('\n') +
      `\n\nTotal: ${variants.reduce((sum, v) => sum + v.qty, 0)} pcs`;
    
    navigator.clipboard.writeText(text);
    showToast("Rekap berhasil disalin ke clipboard!", "success");
  };

  const productNames = [...new Set(productionData.map(d => d.name))];

  return (
    <div className="max-w-7xl mx-auto space-y-2 md:space-y-8 p-4 md:p-8 text-slate-800">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Rekap Produksi</h1>
          <p className="text-slate-500 font-light italic text-sm">Total barang yang harus disiapkan</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
          <Info className="w-4 h-4 text-blue-500" />
          <p className="text-[10px] font-bold text-blue-700 uppercase">
            Total {productionData.reduce((sum, item) => sum + item.qty, 0)} Pcs Terdeteksi
          </p>
        </div>
      </div>

      {/* DYNAMIC TABS */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-1 bg-slate-50/80 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[9px] md:text-xs font-black uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === cat 
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' 
                : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {cat === "TABEL" && <TableIcon size={14} />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT LOGIC */}
      {productNames.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <Package2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Tidak ada antrean</p>
        </div>
      ) : activeTab === "TABEL" ? (
        /* --- RENDER TABEL VIEW --- */
        <div className="space-y-12">
          {Object.entries(tableDataByCategory).map(([category, productsMap]) => {
            // Ambil semua header varian unik untuk kategori ini
            const allVariants = [...new Set(Object.values(productsMap).flatMap(p => Object.keys(p)))].sort();

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200"></span>
                    <h2 className="text-sm font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100">{category}</h2>
                    <span className="h-px flex-1 bg-slate-200"></span>
                </div>
                
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 w-12 text-center">No</th>
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 min-w-[200px]">Nama Produk</th>
                        {allVariants.map(v => (
                          <th key={v} className="p-4 text-[10px] font-black uppercase text-slate-400 text-center">{v}</th>
                        ))}
                        <th className="p-4 text-[10px] font-black uppercase text-emerald-600 text-center bg-emerald-50/50">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(productsMap).map(([pName, vMap], idx) => {
                        const rowTotal = Object.values(vMap).reduce((a, b) => a + b, 0);
                        return (
                          <tr key={pName} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-xs font-bold text-slate-400 text-center">{idx + 1}</td>
                            <td className="p-4 text-xs font-black text-slate-700">{pName}</td>
                            {allVariants.map(v => (
                              <td key={v} className="p-4 text-sm font-medium text-center">
                                {vMap[v] ? (
                                    <span className="bg-slate-100 px-2 py-1 rounded-lg font-bold">{vMap[v]}</span>
                                ) : <span className="text-slate-200">-</span>}
                              </td>
                            ))}
                            <td className="p-4 text-sm font-black text-center bg-emerald-50/30 text-emerald-700">{rowTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- RENDER GRID VIEW (Original) --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Kode Grid Anda Tetap Disini */}
           {productNames.map(productName => {
             const variants = productionData.filter(d => d.name === productName);
             const totalQty = variants.reduce((sum, v) => sum + v.qty, 0);
             return (
               <div key={productName} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm flex flex-col">
                  {/* ... (Isi card grid Anda) ... */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black text-slate-800">{productName}</h3>
                    <button onClick={() => handleCopyToVendor(productName, variants)} className="p-2 bg-slate-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                        <Share2 size={16}/>
                    </button>
                  </div>
                  <div className="space-y-2 flex-1">
                    {variants.map(v => (
                        <div key={v.variant} className="flex justify-between text-xs bg-slate-50 p-2 rounded-xl">
                            <span className="font-bold text-slate-500">{v.variant}</span>
                            <span className="font-black text-slate-800">{v.qty} Pcs</span>
                        </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                    <span className="font-black text-lg text-emerald-600">{totalQty} Pcs</span>
                  </div>
               </div>
             )
           })}
        </div>
      )}
    </div>
  );
}