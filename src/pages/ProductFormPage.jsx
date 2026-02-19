import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import ProductForm from './ProductForm'; // Komponen form yang kita buat sebelumnya
import { ArrowBigLeftDash, ArrowBigLeftDashIcon } from 'lucide-react';

const ProductFormPage = () => {
  const { id } = useParams(); // Ambil ID dari URL (jika ada)
  const navigate = useNavigate();
  const { products, refreshData } = useOutletContext();

  // Jika ada ID, cari data produk dari list yang sudah di-fetch di AdminLayout
  const existingProduct = id ? products.find(p => p.id === id) : null;

  const handleSuccess = () => {
    refreshData(); // Panggil fungsi refresh di AdminLayout agar list produk terbaru
    navigate('/products'); // Kembali ke halaman list
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {id ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400">
          <ArrowBigLeftDashIcon size={24} /> Back
        </button>
      </div>
      
      {/* Kirim data ke komponen form */}
      <ProductForm 
        existingProduct={existingProduct} 
        onSaveSuccess={handleSuccess} 
      />
    </div>
  );
};

export default ProductFormPage;