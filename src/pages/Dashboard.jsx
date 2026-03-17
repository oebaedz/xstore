import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import supabase from '../components/createClient';
import sendWhatsApp from '../context/sendWhatsApp';
import { useToast } from '../context/ToastContext';
import { MessageCircle, X, Check  } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';


export default function Dashboard() {
  const { orders, refreshData } = useOutletContext();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  //State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSendingWA, setIsSendingWA] = useState(false);
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
  
    // State untuk modal detail order
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailOrder, setDetailOrder] = useState(null);

    // Buka Modal Detail Order
    const openDetailModal = (order) => {
      setDetailOrder(order);
      setIsDetailModalOpen(true);
    };

    // Tutup Modal Detail Order
    const closeDetailModal = () => {
      setIsDetailModalOpen(false);
      setDetailOrder(null);
    };

    // Fungsi Detail Order Modal
    const OrderDetailModal = () => {
      return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeDetailModal} />

          {/* Sheet/Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            
            {/* Handle Bar (Hanya untuk feel mobile) */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 sm:hidden" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 leading-none mb-2">{detailOrder?.nama}</h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{detailOrder?.alamat}</span>
              </div>
              <button onClick={closeDetailModal} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* LIST PRODUK */}
            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
              {detailOrder?.order_items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800">{item.products.name}</h4>
                    <p className="text-[10px] font-black text-emerald-600 uppercase">{item.variantName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400">{item.qty}x</p>
                    <p className="text-sm font-black text-slate-800">Rp {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY RINGKAS */}
            <div className="border-t border-dashed border-slate-200 pt-6 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-400">Total Tagihan</span>
                <span className="text-slate-800">Rp {detailOrder?.total_harga.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-400">Sudah Dibayar</span>
                <span className="text-emerald-500">Rp {detailOrder?.dibayar.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-100">
                <span className="text-slate-800 uppercase text-xs self-center">Belum Dibayar</span>
                <span className="text-rose-500">Rp {(detailOrder?.total_harga - detailOrder?.dibayar).toLocaleString()}</span>
              </div>
            </div>

            {detailOrder?.status !== 'lunas' && (
             <button 
               onClick={() => {
                 closeDetailModal(); // Tutup detail dulu
                 openPaymentModal(detailOrder); // Baru buka bayar
               }}
               className="w-full mt-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-100"
             >
               Klik untuk Bayar
             </button>
           )}

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                Print Struk
              </button>
              <button
                onClick={() => {openConfirmModal(detailOrder);}} 
                className="py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100">
                Kirim Nota WA
              </button>
            </div>
          </div>
        </div>
      );
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

  const filteredOrders = orders.filter(order => {

    const matchStatus = 
      filterStatus === 'semua' ? true :
      filterStatus === 'piutang' ? (order.status === 'belum' || order.status === 'dp') :
      order.status === filterStatus;

    const matchesSearch = order.nama.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && matchStatus;
  })

  const openConfirmModal = (order) => {
    setSelectedOrder(order);
    setIsConfirmOpen(true);
  }

  const handleKirimWA = (order) => {
    let pesan = "";
    
    if (order.status === 'dp') {
      pesan = `Halo *${order.nama}*,\n\nPembayaran DP Anda telah kami terima. Pesanan Anda kini masuk antrean produksi.\n\nTerima kasih! 🙏`;
    } else if (order.status === 'lunas') {
      pesan = `Kabar gembira *${order.nama}*!\n\nKami telah menerima pembayaran lunas Anda. Pesanan Anda sedang dalam proses produksi. Terima kasih atas kepercayaan Anda! 😊`;
    } else {
      pesan = `Halo *${order.nama}*,\n\nKami ingin mengingatkan bahwa pembayaran untuk pesanan Anda belum kami terima. Mohon segera lakukan pembayaran agar pesanan Anda bisa segera diproses. Terima kasih! 🙏`;
    }

    if (!pesan) return;
    sendWhatsApp(order.no_hp, pesan);
    showToast('Notifikasi WA telah dikirim.', 'success');
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen pb-10">
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleKirimWA}
        title={`Kirim Pesan WA?`}
        message={`Apakah Anda yakin ingin mengirim pesan WA ke ${selectedOrder?.nama}?`}
        isLoading={isSendingWA}
      />
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-slate-800">Manajemen Pesanan</h1>

      {/* Search Bar */}
      <input 
        type="text"
        placeholder="Cari nama pelanggan..."
        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 shadow-sm outline-none focus:ring-2 focus:ring-green-500"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Horizontal Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['semua', 'piutang', 'dp', 'lunas'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
              filterStatus === f 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
            
          >
            {f === 'piutang' ? '💸 Belum Lunas' : f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between" onClick={() => openDetailModal(order)}>
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
              // onClick={() => openPaymentModal(order)}
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
              onClick={(e) => { e.stopPropagation(); openConfirmModal(order); }}
              className="w-10 h-10 bg-emerald-500 flex items-center justify-center rounded-xl text-white shadow-lg shadow-emerald-200 active:scale-90 transition-all"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* --- MODAL DETAIL PESANAN --- */}
      {isDetailModalOpen && <OrderDetailModal />}

      {/* --- MODAL PEMBAYARAN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-start sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative m-1 bg-white w-full max-w-md rounded-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
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