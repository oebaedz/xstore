import { useNavigate, useOutletContext } from "react-router-dom";
import supabase from "../components/createClient";
import { useToast } from "../context/ToastContext";
import { useState, useMemo } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, Edit3, Trash2, Package, Tag, Layers } from "lucide-react";

const ProductSale = () => {
  const { products, refreshData } = useOutletContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter Produk berdasarkan search
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const onEdit = (product) => {
    product ? navigate(`/products/edit/${product.id}`) : navigate('/products/add');
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', selectedProduct.id);
      if (error) throw error;
      showToast(`Produk "${selectedProduct.name}" berhasil dihapus`, "success");
      refreshData();
    } catch (error) {
      showToast("Gagal menghapus produk", "error");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-8 p-4 md:p-8">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={`Hapus Produk?`}
        message={`Apakah Anda yakin ingin menghapus produk "${selectedProduct?.name}"? Tindakan ini permanen.`}
        isLoading={isDeleting}
      />

      {/* HEADER & ACTION SECTION */}
      <div className="flex flex-row md:items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Katalog Produk</h1>
          <p className="text-slate-500 font-light">Kelola stok dan etalase</p>
        </div>
        
        <button 
          onClick={() => onEdit(null)} 
          className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 border border-emerald-400 rounded-2xl text-xs md:text-sm hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" /> Produk Baru
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
        <input 
          type="text"
          placeholder="Cari nama produk atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
        />
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Produk tidak ditemukan</h3>
          <p className="text-slate-400">Coba kata kunci lain atau tambah produk baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col">
              
              {/* IMAGE WRAPPER */}
              <div className="relative aspect-video mb-6 overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-50">
                <img 
                  src={product.image || 'https://via.placeholder.com/400'} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  alt={product.name}
                />
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-700 shadow-sm uppercase tracking-wider border border-slate-100">
                    <Tag className="w-3 h-3 text-emerald-500" /> {product.category}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 space-y-2 px-1">
                <h3 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-light uppercase tracking-tighter">{product.variants?.length || 0} Varian</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-light text-slate-400 uppercase leading-none">Mulai dari</p>
                    <p className="text-base font-black text-emerald-600">
                      Rp {product.variants?.length > 0 
                        ? Math.min(...product.variants.map(v => v.price)).toLocaleString('id-ID') 
                        : '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => onEdit(product)}
                  className="flex items-center justify-center gap-2 py-3.5 text-xs font-black text-slate-600 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                >
                  <Edit3 className="w-4 h-4" /> EDIT
                </button>
                <button 
                  onClick={() => openDeleteModal(product)} 
                  className="flex items-center justify-center gap-2 py-3.5 text-xs font-black text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" /> HAPUS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSale;