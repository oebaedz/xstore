import { useEffect, useState } from 'react';
import supabase from '../components/createClient';
import { useOutletContext } from 'react-router-dom';
import sendWhatsApp from '../context/sendWhatsApp';


export default function Dashboard() {
  const { orders, refreshData } = useOutletContext();

  const updateStatus = async (id, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    refreshData(); // Refresh data setelah update
  };

  const handleKirimNotifikasi = async (order) => {
  let pesan = "";
  
  if (order.status === 'paid') {
    pesan = `Halo *${order.nama}*,\nPembayaran Anda telah kami terima. Pesanan Anda kini masuk antrean produksi.\n\nTerima kasih! 🙏`;
  } else if (order.status === 'shipped') {
    pesan = `Kabar gembira *${order.nama}*!\nPesanan kaos Anda telah dikirim. Mohon ditunggu kedatangannya ya. 😊`;
  }

  if (!pesan) return;

  // Tampilkan konfirmasi terakhir sebelum benar-benar kirim
  const konfirmasi = window.confirm(`Kirim notifikasi WA ke ${order.nama}?`);
  
  if (konfirmasi) {
    sendWhatsApp(order.no_hp, pesan);

    window.alert('Notifikasi WA telah dikirim.');
  }
};

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Daftar Pesanan</h1>

      {/* --- SUMMARY BOARD ---
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {rekap.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-500 uppercase font-bold">{item.variant_lengan} - {item.variant_size}</p>
            <p className="text-2xl font-black text-blue-600">{item.total_pcs} <span className="text-sm font-normal text-slate-400">pcs</span></p>
          </div>
        ))}
      </div> */}

      {/* --- TABLE PESANAN --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-sm font-bold text-slate-600">Pelanggan</th>
                <th className="p-4 text-sm font-bold text-slate-600">Total Bayar</th>
                <th className="p-4 text-sm font-bold text-slate-600">Status</th>
                {/* <th className="p-4 text-sm font-bold text-slate-600">Aksi</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{order.nama}</p>
                    <p className="text-xs text-slate-500">{order.no_hp}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-700">
                    Rp {order.total_harga.toLocaleString('id-ID')}
                  </td>
                  {/* <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td> */}
                  {/* // Di dalam loop orders.map((order) => ...) */}
                    <td className="p-4 flex items-center gap-3">
                      {/* Dropdown Status */}
                      <select 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold border rounded-lg p-1.5 outline-none transition-all ${
                          order.status === 'paid' ? 'border-green-200 bg-green-50 text-green-700' :
                          order.status === 'shipped' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                          'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                        value={order.status}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="paid">✅ Paid</option>
                        <option value="shipped">🚀 Shipped</option>
                      </select>

                      {/* Tombol Kirim WA (Hanya muncul jika bukan pending) */}
                      {order.status !== 'pending' && (
                        <button 
                          onClick={() => handleKirimNotifikasi(order)}
                          className="flex items-center justify-center w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-sm hover:shadow-md transition-all active:scale-90"
                          title="Kirim Notifikasi WA"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                          </svg>
                        </button>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}