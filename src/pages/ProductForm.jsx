import React, { useState, useEffect } from 'react';
import supabase from '../components/createClient';
import { Plus, Trash2, Save, Package, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import ImageUploader from '../components/newcomps/ImageUploader';

const ProductForm = ({ existingProduct, onSaveSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  
  const initialFormState = {
    name: '',
    desc: '',
    category: 'Foto+Figura', // Beri default agar tidak null
    image: '',
    variants: []
  };

  const [product, setProduct] = useState(initialFormState);

  // Sync data saat edit mode aktif atau berganti produk
  useEffect(() => {
    if (existingProduct) {
      setProduct({
        ...initialFormState,
        ...existingProduct,
        variants: existingProduct.variants || []
      });
    } else {
      setProduct(initialFormState);
    }
  }, [existingProduct?.id]); // Hanya trigger jika ID berubah

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const addVariantField = () => {
    const newVar = { 
      id: crypto.randomUUID().substring(0, 8), // ID unik pendek
      name: '', 
      price: 0 
    };
    setProduct(prev => ({ ...prev, variants: [...prev.variants, newVar] }));
  };

  // Fungsi mengubah angka ke format ribuan: 10000 -> 10.000
  const formatRupiah = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // Fungsi membersihkan titik agar jadi angka murni: "10.000" -> 10000
  const cleanNumber = (value) => {
    return value.replace(/\./g, "").replace(/[^0-9]/g, "");
  };

  const updateVariantField = (index, field, value) => {
    setProduct(prev => {
      const newVariants = [...prev.variants];

      let finalValue = value;
      if (field === 'price') {
        // Jika input harga, bersihkan format ribuan dan pastikan angka
        const cleaned = cleanNumber(value);
        finalValue = cleaned === "" ? 0 : parseInt(cleaned);
      }

      newVariants[index] = { ...newVariants[index], [field]: finalValue };
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariantField = (index) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (product.variants.length === 0) {
      showToast("Minimal harus ada 1 varian produk", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = existingProduct 
        ? await supabase.from('products').update(product).eq('id', existingProduct.id)
        : await supabase.from('products').insert([product]);

      if (error) throw error;

      showToast(
        existingProduct ? "Produk diperbarui!" : "Produk ditambahkan!", 
        "success"
      );
      
      if (onSaveSuccess) onSaveSuccess();
      if (!existingProduct) setProduct(initialFormState); // Reset jika input baru

    } catch (error) {
      showToast("Gagal: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl text-slate-800 mx-auto p-4 md:p-8 bg-white rounded-[2rem] border border-slate-200 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Informasi Produk
          </h1>
          <p className="text-slate-500 text-sm">Kelola informasi katalog dan varian harga</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* KOLOM KIRI: INFO UTAMA */}
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700 ml-1">Nama Produk</span>
            <input 
              name="name" value={product.name} onChange={handleMainChange}
              placeholder="Masukkan nama produk..." 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700 ml-1">Kategori</span>
            <select 
              name="category" value={product.category} onChange={handleMainChange}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none"
            >
              <option value="Foto+Figura">Foto + Figura</option>
              <option value="Foto">Foto</option>
              <option value="Kaos">Kaos</option>
              <option value="Aksesoris">Aksesoris</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700 ml-1">Deskripsi</span>
            <textarea 
              name="desc" value={product.desc} onChange={handleMainChange}
              placeholder="Ceritakan detail produk..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl h-32 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none"
            />
          </label>
        </div>

        {/* KOLOM KANAN: MEDIA */}
        <div className="space-y-5">
          <span className="text-sm font-semibold text-slate-700 ml-1 block">Media Utama</span>
          <div className="relative group overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-emerald-400 transition-colors">
            {product.image ? (
              <div className="relative aspect-video">
                <img src={product.image} className="w-full h-full object-contain" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <p className="text-white text-sm font-medium">Ganti Gambar</p>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-slate-400">
                <Package className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-xs">Belum ada foto terpilih</p>
              </div>
            )}
            <div className="p-4">
              <ImageUploader 
                folder="product-images"
                aspectRatio='w-full h-12'
                onUploadSuccess={(url) => setProduct(prev => ({ ...prev, image: url }))}
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-10 border-slate-100" />

      {/* VARIANTS SECTION */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Varian Produk</h3>
            <p className="text-slate-500 text-xs">Tambahkan ukuran, warna, atau model</p>
          </div>
          <button 
            type="button" onClick={addVariantField}
            className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-200"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {product.variants.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Klik tombol tambah untuk membuat varian harga</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {product.variants.map((v, index) => (
            <div key={v.id || index} className="group flex flex-wrap md:flex-nowrap gap-4 p-4 bg-white border border-slate-200 rounded-2xl items-center hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-[100px]">
                <input 
                  placeholder="ex: S, L, 10R, 14R" value={v.name}
                  onChange={(e) => updateVariantField(index, 'name', e.target.value)}
                  className="w-full p-2 text-sm font-medium border-none focus:ring-0 bg-transparent outline-none"
                  required
                />
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-sm font-semibold">Rp</span>
                <input 
                  type="number" placeholder="0" value={formatRupiah(v.price)}
                  onChange={(e) => updateVariantField(index, 'price', e.target.value)}
                  className="w-24 bg-transparent text-sm font-bold text-slate-700 outline-none"
                  required
                />
              </div>

              <button 
                type="button" onClick={() => removeVariantField(index)}
                className="md:p-2 text-red-400 md:text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <button 
          type="submit" disabled={loading}
          className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-200/50 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {loading ? 'Sedang Memproses...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;