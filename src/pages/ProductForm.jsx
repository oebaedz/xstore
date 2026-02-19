import React, { useState, useEffect } from 'react';
import supabase from '../components/createClient';
import { Plus, Trash2, Save, Package } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ProductForm = ({ existingProduct, onSaveSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [product, setProduct] = useState({
    name: '',
    desc: '',
    category: 'Bingkai',
    image: '',
    variants: [] // Array JSONB kita
  });

  // Load data jika dalam mode Edit
  useEffect(() => {
    if (existingProduct) setProduct(existingProduct);
  }, [existingProduct]);

  // Handler Input Produk Utama
  const handleMainChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // --- LOGIKA DINAMIS VARIANT ---
  const addVariantField = () => {
    const newVar = { id: Date.now().toString(), name: '', price: "", image: '' };
    setProduct({ ...product, variants: [...product.variants, newVar] });
  };

  const updateVariantField = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  const removeVariantField = (index) => {
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: newVariants });
  };

  // --- SUBMIT KE SUPABASE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = existingProduct 
      ? await supabase.from('products').update(product).eq('id', product.id)
      : await supabase.from('products').insert([product]);

    setLoading(false);
    if (!error) {
      showToast( existingProduct ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan", "success"); 
      if (onSaveSuccess) onSaveSuccess();
    } else {
      showToast("Gagal menyimpan produk: " + error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-3 md:p-6 space-y-8 bg-white rounded-3xl border border-slate-100 shadow-xl">
      {/* SECTION 1: INFO UTAMA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-800 text-lg">
            <Package className="w-5 h-5 text-emerald-700" /> Informasi Produk
          </h2>
          <input 
            name="name" value={product.name} onChange={handleMainChange}
            placeholder="Nama Produk (ex: Foto Dua Kiai)" 
            className="w-full p-3 bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            required
          />
          <select 
            name="category" value={product.category} onChange={handleMainChange}
            className="w-full text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
          >
            <option value="Foto+Figura">Foto + Figura</option>
            <option value="Foto">Foto</option>
            <option value="Kaos">Kaos</option>
            <option value="Aksesoris">Aksesoris</option>
          </select>
          <textarea 
            name="desc" value={product.desc} onChange={handleMainChange}
            placeholder="Deskripsi singkat..."
            className="w-full text-slate-800 focus:ring-2 focus:ring-emerald-600 p-3 bg-slate-50 border border-slate-200 rounded-2xl h-24 outline-none"
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-slate-800 text-lg">Foto Utama</h2>
          <input 
            name="image" value={product.image} onChange={handleMainChange}
            placeholder="URL Gambar Utama" 
            className="w-full focus:ring-2 focus:ring-emerald-600 text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
          />
          {product.image && (
            <img src={product.image} className="w-full h-40 object-contain rounded-2xl border" alt="Preview" />
          )}
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* SECTION 2: DYNAMIC VARIANTS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg">Daftar Varian (JSONB)</h2>
          <button 
            type="button" onClick={addVariantField}
            className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 border border-emerald-300 transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Varian
          </button>
        </div>

        <div className="space-y-3">
          {product.variants.map((v, index) => (
            <div key={index} className="flex flex-wrap text-slate-800 md:flex-nowrap gap-3 p-2 md:p-4 bg-slate-50 rounded-2xl items-center border border-slate-100">
              <input 
                placeholder="ID (ex: 02-01)" value={v.id}
                onChange={(e) => updateVariantField(index, 'id', e.target.value)}
                className="w-20 p-2 text-xs font-mono border bg-white rounded-lg outline-none"
                hidden
              />
              <input 
                placeholder="Nama (ex: 20R)" value={v.name}
                onChange={(e) => updateVariantField(index, 'name', e.target.value)}
                className="flex-1 min-w-[80px] p-2 text-sm bg-white border rounded-lg outline-none"
              />
              <div className="relative">
                <span className="absolute left-2 top-2 text-slate-400 text-sm">Rp</span>
                <input 
                  type="number" placeholder="Harga" value={v.price}
                  onChange={(e) => updateVariantField(index, 'price', parseInt(e.target.value))}
                  className="w-28 pl-8 p-2 text-sm border bg-white rounded-lg outline-none"
                />
              </div>
              <button 
                type="button" onClick={() => removeVariantField(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <button 
        type="submit" disabled={loading}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:bg-slate-300"
      >
        <Save className="w-5 h-5" /> {loading ? 'Menyimpan...' : 'Simpan Produk'}
      </button>
    </form>
  );
};

export default ProductForm;