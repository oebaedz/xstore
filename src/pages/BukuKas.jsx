import { useMemo, useState } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet, Filter, Trash2, Loader } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import supabase from '../components/createClient';
import {useToast} from '../context/ToastContext'

const BukuKas = () => {
  const {transactions, refreshData} = useOutletContext();
  const [formData, setFormData] = useState({
    type: 'keluar',
    category: 'Operasional',
    amount: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kategoriOptions = [
    'Operasional',
    'Pembayaran Pelanggan',
    'Produksi',
    'Transport',
    'Lainnya'
  ];

  // 1. Logika Perhitungan Saldo
  const stats = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'masuk') acc.totalMasuk += t.amount;
      else acc.totalKeluar += t.amount;
      acc.saldo = acc.totalMasuk - acc.totalKeluar;
      return acc;
    }, { totalMasuk: 0, totalKeluar: 0, saldo: 0 });
  }, [transactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDASI
    if(!formData.amount || parseFloat(formData.amount) <= 0) {
      showToast('Masukkan jumlah nominal yang valid', 'error')
      return
    }

    if(!formData.description.trim()) {
      showToast('Deskripsi tidak boleh kosong', 'error')
      return
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('transactions')
        .insert({
          type: formData.type,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
        });

      if (error) throw error;

      showToast('Transaksi berhasil ditambahkan!', 'success');
      await refreshData();
      setIsModalOpen(false)
      
      // Reset form and refresh data
      setFormData({
        type: 'keluar',
        category: 'Operasional',
        amount: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting transaction:', error);
      showToast('Gagal menambahkan transaksi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (t) => {
    const confirmDelete = window.confirm("Hapus transaksi ini? Saldo kas akan berubah.");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);

      // 1. Jika transaksi terkait dengan ORDER, kurangi nilai 'dibayar' di order tersebut
      if (t.order_id) {
        // Ambil data order terbaru untuk mendapatkan nilai 'dibayar' saat ini
        const { data: currentOrder } = await supabase
          .from('orders')
          .select('dibayar, total_harga')
          .eq('id', t.order_id)
          .single();

        if (currentOrder) {
          const nominalBaru = Math.max(0, currentOrder.dibayar - t.amount);
          let statusBaru = 'dp';
          if (nominalBaru === 0) statusBaru = 'belum';
          if (nominalBaru >= currentOrder.total_harga) statusBaru = 'lunas';

          await supabase
            .from('orders')
            .update({ dibayar: nominalBaru, status: statusBaru })
            .eq('id', t.order_id);
        }
      }

      // 2. Hapus transaksi dari tabel transactions
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', t.id);

      if (error) throw error;

      showToast('Transaksi berhasil dihapus', 'success');
      await refreshData();
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus transaksi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <form 
            onSubmit={handleSubmit} 
            className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800">Tambah Transaksi</h3>
                <p className="text-xs text-slate-400 mt-1">Catat pemasukan atau pengeluaran</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">

              {/* Jenis */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['masuk', 'keluar'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`py-3 rounded-xl font-bold text-sm capitalize transition-all ${
                        formData.type === type
                          ? type === 'masuk'
                            ? 'bg-emerald-200 text-emerald-700 shadow-sm shadow-emerald-200'
                            : 'bg-red-200 text-red-700 shadow-sm shadow-red-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-slate-700 font-semibold"
                >
                  <option value="" disabled>Pilih kategori</option>
                  {kategoriOptions.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jumlah */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  min='0'
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-3 text-xl font-black text-slate-800 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Tambahkan catatan..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* --- SECTION: RINGKASAN SALDO --- */}
      <section className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Saldo Kas</p>
        <h2 className="text-3xl font-black mb-6">Rp {stats.saldo.toLocaleString()}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpCircle size={14} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Masuk</span>
            </div>
            <p className="text-sm font-bold text-emerald-400">+{stats.totalMasuk.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownCircle size={14} className="text-rose-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Keluar</span>
            </div>
            <p className="text-sm font-bold text-rose-400">-{stats.totalKeluar.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* --- SECTION: DAFTAR TRANSAKSI --- */}
      <section className="space-y-4 px-1">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Wallet size={18} className="text-emerald-600" /> Riwayat Transaksi
          </h3>
          <button className="p-2 bg-slate-100 rounded-xl text-slate-500">
            <Filter size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-3xl border border-slate-50 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${t.type === 'masuk' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  {t.type === 'masuk' ? 
                    <ArrowUpCircle className="text-emerald-500" size={20} /> : 
                    <ArrowDownCircle className="text-rose-500" size={20} />
                  }
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm capitalize">{t.category}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{t.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-black text-sm ${t.type === 'masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'masuk' ? '+' : '-'} {t.amount.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase">
                    {new Date(t.created_at).toLocaleTimeString('id-ID', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' })}
                  </p>
                </div>
                
                {/* Tombol Hapus - Muncul saat di-hover (di desktop) atau terlihat di mobile */}
                <button 
                  onClick={() => handleDelete(t)}
                  disabled={isLoading}
                  className={`p-0 text-rose-500 md:text-slate-300 hover:text-rose-500 transition-colors`}
                >
                  { !isLoading ? <Trash2 size={14} /> : <Loader size={14} /> }
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FLOATING ACTION BUTTON (Untuk Input Manual) --- */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
        <Plus size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

export default BukuKas;