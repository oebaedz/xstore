import { ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;
  const items = location.state?.items || [];

  if (!order) return <div className="min-h-[100vh] text-center py-20">Pesanan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-sm overflow-hidden border border-border">
        
        {/* Header Sukses */}
        <div className="bg-primary p-8 text-center border-b-4 border-gold">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/50">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-gold uppercase tracking-tighter">Terima kasih</h1>
          <p className="text-text-muted text-xs mt-2 uppercase tracking-[0.2em]">Pesanan Anda Telah Kami Terima</p>
        </div>

        <div className="p-8">
          {/* Info Utama */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Nama Pemesan</h3>
              <p className="font-display text-xl font-bold text-primary">{order.nama}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Pembayaran</h3>
              <p className="font-display text-2xl font-bold text-gold">Rp {order.total_harga.toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Rincian Produk */}
          <div className="border-t border-border pt-6 mb-8">
            <h3 className="font-display text-lg font-bold text-primary mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} <span className="text-[10px] bg-muted px-2 py-0.5 ml-2 italic">{item.variantName}</span></span>
                  <span className="font-bold text-primary">x{item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PERINGATAN PEMBAYARAN - DP/PELUNASAN */}
          <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-sm mb-8">
            <div className="flex flex-col items-start gap-4">
              <span className="text-2xl text-center w-full">⚠️</span>
              <h4 className="font-bold text-primary uppercase w-full text-center text-sm">Instruksi Pembayaran Penting</h4>
              <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
                <li>Harap melakukan <strong>DP minimal 50%</strong> atau <strong>Pelunasan</strong> untuk mengamankan slot produksi.</li>
                <li>Pembayaran via transfer bank ke nomor rekening <strong>BRI: 12345678901213131</strong> an. <strong>A. Jamil Hidayat</strong></li>
                <li>Kirim bukti transfer melalui WhatsApp Admin.</li>
              </ul>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3">
            <Link 
              to="/" 
              className="border-2 border-primary text-primary text-center py-4 px-4 md:px-8 font-bold md:tracking-[0.2em] hover:bg-primary/5 transition-all text-xs md:text-sm flex-2"
            >
              <ArrowLeft className="inline mr-2" size={12} /> BERANDA
            </Link>
            <a 
              href={`https://wa.me/62812345678?text=Konfirmasi%20Pesanan%20${order.order_id}`}
              className="w-full bg-accent-green text-white text-center py-4 font-bold tracking-[0.2em] hover:bg-accent-green-dark transition-all text-xs md:text-sm flex-1"
            >
              BUKA WHATSAPP
            </a>
          </div>
        </div>

        <div className="bg-muted p-4 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest italic">Iksada Store - Membeli dan Beramal</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;