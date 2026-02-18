import { useNavigate, useOutletContext } from "react-router-dom";
import supabase from "../components/createClient";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal"

const ProductSale = () => {

  const { products, refreshData } = useOutletContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onEdit = (product) => {
    product ? navigate(`/products/edit/${product.id}`) : navigate('/products/add');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
      
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
    <div className="space-y-6">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={`Hapus Produk?`}
        message={`Apakah Anda yakin ingin menghapus produk "${selectedProduct?.name}"? Produk yang telah dihapus tidak dapat dikembalikan.`}
        isLoading={isDeleting}
      />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
        <button onClick={() => onEdit(null)} className="bg-accent-green text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-accent/20 hover:bg-accent/50 transition-all">
          + Produk Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="relative h-60 mb-4">
              <img 
                src={product.image} 
                className="w-full h-full object-contain rounded-2xl" 
                alt={product.name}
              />
              <div className="absolute top-2 right-2 bg-gold backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-black shadow-sm">
                {product.category}
              </div>
            </div>

            <h3 className="font-bold text-slate-800 mb-1 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400">
                {product.variants.length} Varian tersedia
              </p>
              <p className="text-sm font-bold text-slate-700">
                Rp {Math.min(...product.variants.map(v => v.price)).toLocaleString()}+
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onEdit(product)}
                className="py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
              >
                Edit Detail
              </button>
              <button onClick={() => openDeleteModal(product)} 
              className="py-2 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all">
                Hapus Produk
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSale;