import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import supabase from '../components/createClient';
import sendWhatsApp from '../context/sendWhatsApp';
import { useToast } from '../context/ToastContext';
import { Edit3, MessageCircle, X, Check  } from 'lucide-react';


export default function Dashboard() {
  const { orders, refreshData } = useOutletContext();
  const { showToast } = useToast();

  //State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inputBayar, setInputBayar] = useState(0);

  // Buka Modal & Set Order yang Dipilih
  const openPaymentModal = (order) => {
    setSelectedOrder(order);
    setInputBayar(order.dibayar || 0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setInputBayar(0);
  };

  const handleUpdateBayar = async () => {
    const nominalBayar = parseInt(inputBayar);
    if (isNaN(nominalBayar) || nominalBayar < 0) {
      showToast('Masukkan nominal yang valid', 'error');
      return;
    }
    let newStatus = 'belum';
    if (nominalBayar >= selectedOrder.total_harga) {
      newStatus = 'lunas';
    } else if (nominalBayar > 0) {
      newStatus = 'dp';
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ dibayar: nominalBayar, status: newStatus })
        .eq('id', selectedOrder.id);

      if (error) throw error;
      await refreshData(); // Refresh data setelah update
      showToast('Data pembayaran berhasil diperbarui', 'success');
      closeModal();
    } catch (error) {
      console.error('Error updating payment data:', error);
      showToast('Gagal memperbarui data pembayaran', 'error');
    }
  };

  const handleKirimWA = (order) => {
    let pesan = "";
    
    if (order.status === 'dp') {
      pesan = `Halo *${order.nama}*,\nPembayaran DP Anda telah kami terima. Pesanan Anda kini masuk antrean produksi.\n\nTerima kasih! 🙏`;
    } else if (order.status === 'lunas') {
      pesan = `Kabar gembira *${order.nama}*!\nKami telah menerima pembayaran lunas Anda. Pesanan Anda sedang dalam proses produksi. Terima kasih atas kepercayaan Anda! 😊`;
    } else {
      pesan = `Halo *${order.nama}*,\nKami ingin mengingatkan bahwa pembayaran untuk pesanan Anda belum kami terima. Mohon segera lakukan pembayaran agar pesanan Anda bisa segera diproses. Terima kasih! 🙏`;
    }

    if (!pesan) return;

    // Tampilkan konfirmasi terakhir sebelum benar-benar kirim
    const konfirmasi = window.confirm(`Kirim notifikasi WA ke ${order.nama}?`);
    
    if (konfirmasi) {
      sendWhatsApp(order.no_hp, pesan);
      showToast('Notifikasi WA telah dikirim.', 'success');
    }
  };

  return (
    <div className="p-2 md:p-8 bg-slate-50 min-h-screen pb-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-slate-800">Manajemen Pesanan</h1>

      {/* --- SUMMARY BOARD ---
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {rekap.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-500 uppercase font-bold">{item.variant_lengan} - {item.variant_size}</p>
            <p className="text-2xl font-black text-blue-600">{item.total_pcs} <span className="text-sm font-normal text-slate-400">pcs</span></p>
          </div>
        ))}
      </div> */}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            {/* Info Pelanggan */}
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 leading-none mb-1">{order.nama}</h3>
              <p className="text-[10px] text-slate-400 mb-2">{order.no_hp}</p>
              
              {/* Badge Status Otomatis */}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                order.status === 'lunas' ? 'bg-green-100 text-green-600' :
                order.status === 'dp' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Kolom Harga & Bayar (Clickable) */}
            <div 
              onClick={() => openPaymentModal(order)}
              className="flex flex-col items-end px-4 cursor-pointer active:scale-95 transition-transform"
            >
              <p className="text-[10px] text-slate-400 leading-none">Dibayar / Total</p>
              <p className="text-sm font-black text-slate-700">
                <span className={order.status === 'lunas' ? 'text-green-600' : 'text-yellow-600'}>
                  {order.dibayar?.toLocaleString('id-ID')}
                </span>
                <span className="text-slate-300 mx-1">/</span>
                {order.total_harga?.toLocaleString('id-ID')}
              </p>
            </div>

            {/* Tombol WA */}
            <button 
              onClick={() => handleKirimWA(order)}
              className="w-10 h-10 bg-emerald-500 flex items-center justify-center rounded-xl text-white shadow-lg shadow-emerald-200 active:scale-90 transition-all"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* --- MODAL PEMBAYARAN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative mx-1 bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Update Pembayaran</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Nama Pelanggan</label>
                <p className="font-bold text-slate-700">{selectedOrder?.nama}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Nominal Bayar (Rp)</label>
                <input 
                  type="number"
                  value={inputBayar}
                  onChange={(e) => setInputBayar(e.target.value)}
                  className="w-full text-2xl bg-slate-50 font-black text-green-700 border-b-2 border-slate-100 focus:border-green-700 outline-none py-2"
                  autoFocus
                />
              </div>

              {/* Shortcut Button */}
              <button 
                onClick={() => setInputBayar(selectedOrder.total_harga)}
                className="w-full py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 border border-dashed border-slate-200"
              >
                Set Lunas (Rp {selectedOrder?.total_harga?.toLocaleString('id-ID')})
              </button>

              <button 
                onClick={handleUpdateBayar}
                className="w-full bg-green-600 hover:bg-accent-green-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 mt-4"
              >
                <Check size={20} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}