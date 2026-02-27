import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../createClient';
import sendWhatsApp from '../../context/sendWhatsApp';

const CheckoutModal = ({ isOpen, onClose, items, setItems }) => {
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'form'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const navigate = useNavigate();

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const getPhoneStatus = (number) => {
    if (!number) return { message: '', color: '', valid: false };
    
    const cleanNumber = number.trim();
    
    if (!/^\d+$/.test(cleanNumber)) {
      return { message: 'Hanya boleh angka saja', color: 'text-red-500', valid: false };
    }
    if (!(cleanNumber.startsWith('08') || cleanNumber.startsWith('62'))) {
      return { message: 'Gunakan format 08... atau 62...', color: 'text-red-500', valid: false };
    }
    if (cleanNumber.length < 10) {
      return { message: 'Min. 10 digit', color: 'text-amber-500', valid: false };
    }
    
    return { message: 'Nomor sudah benar', color: 'text-green-600', valid: true };
  };
  const getNameStatus = (name) => {
    if (!name.trim()) return { message: '', color: '', valid: false };
    if (name.trim().length < 3) return { message: 'Minimal 3 karakter', color: 'text-amber-500', valid: false };
    return { message: 'Nama sudah sesuai', color: 'text-green-600', valid: true };
  };

  const getAddressStatus = (address) => {
    if (!address.trim()) return { message: '', color: '', valid: false };
    if (address.trim().length < 10) return { message: 'Min. 10 karakter', color: 'text-amber-500', valid: false };
    return { message: 'Alamat sudah lengkap', color: 'text-green-600', valid: true };
  };

  // Panggil di atas return
  const nameStatus = getNameStatus(formData.name);
  const addressStatus = getAddressStatus(formData.address);
  const phoneStatus = getPhoneStatus(formData.phone);

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

    const message = `*IKSADA STORE*\n\nTerima kasih, pesanan Anda telah kami terima dengan rincian sebagai berikut:\n\nNama: *${formData.name}*\nNo. HP: *${formData.phone}*\nAlamat: *${formData.address}*\n\nOrderan:\n${items.map(item => `- ${item.name} x ${item.qty} = Rp ${item.price * item.qty}`).join('\n')}\n\nTotal Harga: *Rp ${total.toLocaleString("id-ID")}*\n\nMohon lakukan pembayaran DP minimal 50% ke rekening berikut:\nBRI a/n: A. JAMIL HIDAYATULLAH\nNo. Rekening: 0582-0102-0919-50-4\nKonfirmasi (WhatsApp) : 082228326870\n\nTerima kasih atas kepercayaan Anda kepada kami!`;

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
        product_id: item.productId,
        variant_id: item.variantId,
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
      sendWhatsApp(formData.phone, message);
      console.log("Pesan WhatsApp terkirim:", message);

      setItems([]);
      onClose();
      setStatus('idle');
      setFormData({ name: '', phone: '', address: '' })
      console.log("Data order yang disimpan:", { ...orderForm, items: itemsToInsert });

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
                <form onSubmit={handleSubmit} className="space-y-6 text-primary animate-fade-in">
                  {/* INPUT NAMA */}
                  <div>
                    <div className="label flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Nama Lengkap *</label>
                      {nameStatus.message && (
                        <span className={`text-[10px] font-bold ${nameStatus.color} flex items-center gap-1 animate-fade-in`}>
                          {nameStatus.valid ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}{nameStatus.message}
                        </span>
                      )}
                    </div>
                    <input 
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 outline-none border-2 transition-all 
                        ${!formData.name.trim() ? 'border-gray-400' : (nameStatus.valid ? 'border-green-500' : 'border-amber-400')}`}
                      placeholder="Masukkan nama Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  {/* INPUT WHATSAPP */}
                  <div>
                    <div className='label flex justify-between items-center mb-2'>
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Nomor WhatsApp *</label>
                      {phoneStatus.message && (
                        <span className={`text-[10px] font-bold ${phoneStatus.color} flex items-center gap-1 animate-fade-in`}>
                          {phoneStatus.valid ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}{phoneStatus.message}
                        </span>
                      )}
                    </div>
                    <input 
                      required type="tel" 
                      className={`w-full px-4 py-3 bg-gray-50 outline-none border-2 transition-all 
                        ${!formData.phone.trim() ? 'border-gray-400' : (phoneStatus.valid ? 'border-green-500' : 'border-red-400')}`}
                      placeholder="Contoh: 08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  {/* INPUT ALAMAT */}
                  <div>
                    <div className="label flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Alamat *</label>
                      {addressStatus.message && (
                        <span className={`text-[10px] font-bold ${addressStatus.color} flex items-center gap-1 animate-fade-in`}>
                          {addressStatus.valid ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}{addressStatus.message}
                        </span>
                      )}
                    </div>
                    <textarea 
                      required rows="3" 
                      className={`w-full px-4 py-3 bg-gray-50 outline-none border-2 transition-all 
                        ${!formData.address.trim() ? 'border-gray-400' : (addressStatus.valid ? 'border-green-500' : 'border-amber-400')}`} 
                      placeholder="Contoh: Desa Nung Geni Nyu Anyar"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  {/* TOMBOL AKSI */}
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setActiveTab('review')} className="flex-1 border-2 border-primary text-primary font-bold py-4 text-xs tracking-widest hover:bg-primary/5">
                      KEMBALI
                    </button>
                    <button 
                      type="submit" 
                      disabled={status === 'loading' || !nameStatus.valid || !phoneStatus.valid || !addressStatus.valid}
                      className="flex-[2] bg-accent-green hover:bg-accent-green-dark text-white font-bold py-4 px-8 text-xs tracking-[0.2em] transition-all shadow-lg disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {status === 'loading' ? 'MEMPROSES...' : 'KIRIM PESANAN'}
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