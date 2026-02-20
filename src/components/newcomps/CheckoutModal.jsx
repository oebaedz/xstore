import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../createClient';

const CheckoutModal = ({ isOpen, onClose, items, setItems }) => {
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'form'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const navigate = useNavigate();

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Persiapkan data sesuai format script (items_json)
    const orderForm = {
      nama: formData.name,
      no_hp: formData.phone,
      alamat: formData.address,
      total_harga: total,
      status: 'belum',
      dibayar: 0,
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderForm)
        .select()

      if (orderError) {
        setStatus('idle');
        return "Gagal membuat pesanan: " + orderError.message;
      }

      const orderId = orderData[0].id;

      const itemsToInsert = items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        price: item.price,
        qty: item.qty,
        subtotal: item.qty * item.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        setStatus('idle');
        return "Gagal menyimpan item pesanan: " + itemsError.message;
      }
      setItems([]);
      onClose();
      setStatus('idle');
      setFormData({ name: '', phone: '', address: '' })

      navigate('/success', { state: { order: orderData[0], items } });
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="bg-primary p-6 text-white border-b-2 border-gold flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-gold uppercase tracking-tighter">Checkout</h2>
          <button onClick={onClose} className="text-gold hover:text-white text-3xl">&times;</button>
        </div>

        <div className="p-6">
          {status === 'success' ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-50 text-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-green-700 font-bold text-xl uppercase tracking-widest">✓ Pesanan Berhasil!</p>
              <p className="text-gray-500 text-sm mt-2">Terima kasih telah berbelanja di IKSADA Store.</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-4 mb-6 border-b-2 border-gray-100">
                <button 
                  className={`pb-3 px-2 transition-all ${activeTab === 'review' ? 'text-primary border-b-2 border-accent-green' : 'text-gray-400 border-transparent'}`}
                  onClick={() => setActiveTab('review')}
                >
                  1. Review Pesanan
                </button>
                <button 
                  className={`pb-3 px-2 transition-all ${activeTab === 'form' ? 'text-primary border-b-2 border-accent-green' : 'text-gray-400 border-transparent'}`}
                  onClick={() => items.length > 0 && setActiveTab('form')}
                >
                  2. Data Pemesan
                </button>
              </div>

              {activeTab === 'review' ? (
                /* Tab 1: Review */
                <div className="animate-fade-in">
                  <h3 className="font-display text-xl font-bold text-primary mb-4">Ringkasan Pesanan</h3>
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, i) => (
                      <div key={i} className="border-l-4 border-accent-green pl-4 py-2 bg-muted/30">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-semibold text-primary text-sm uppercase">{item.name}</h4>
                          <span className="text-xs text-gray-600">x{item.qty}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-1">{item.variantInfo}</p>
                        <p className="text-sm font-bold text-gold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-100 p-4 rounded-sm mb-6 border border-border">
                    {/* <div className="h-px bg-gold/30 my-3"></div> */}
                    <div className="flex justify-between items-center"><span className="font-bold text-primary uppercase">Total:</span> <span className="font-display text-2xl font-bold text-gold">Rp {total.toLocaleString('id-ID')}</span></div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('form')}
                    className="w-full bg-accent-green hover:bg-accent-green-dark text-white font-semibold py-4 rounded-sm tracking-widest transition-all"
                  >
                    LANJUT KE DATA PEMESAN
                  </button>
                </div>
              ) : (
                /* Tab 2: Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-primary font-bold animate-fade-in">
                  <h3 className="font-display text-xl font-bold text-primary mb-6">Isi Data Anda</h3>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Nama Lengkap *</label>
                    <input 
                      required 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-accent-green outline-none" 
                      placeholder="Masukkan nama Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Nomor WhatsApp *</label>
                    <input 
                      required type="tel" 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-accent-green outline-none" 
                      placeholder="Contoh: 08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Alamat Lengkap *</label>
                    <textarea 
                      required rows="3" 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-accent-green outline-none" 
                      placeholder="Nama Desa / Kelurahan, Kecamatan, Kota"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setActiveTab('review')} className="flex-2 px-8 border-2 border-primary text-primary font-bold py-4 text-xs tracking-widest">KEMBALI</button>
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="flex-1 bg-accent-green hover:bg-accent-green-dark text-white font-bold py-4 px-8 text-xs tracking-[0.2em] transition-all disabled:bg-gray-300"
                    >
                      {status === 'loading' ? 'SEDANG MEMPROSES...' : 'KIRIM PESANAN'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;