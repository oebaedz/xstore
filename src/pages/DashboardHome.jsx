import { AlertCircle, ChevronRight, MessageSquare, PackageCheck, TrendingUp, Trophy, Wallet, X, Zap } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import sendWhatsApp from "../context/sendWhatsApp";

const DashboardHome = () => {
    const {orders = []} = useOutletContext();
    const [activeOrder, setActiveOrder] = useState(null); // State untuk popup heatmap
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setActiveOrder(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fungsi untuk menangani aksi "Senggol" (Kirim WA)
    const handleSenggol = (order) => {
        const waNumber = order.no_hp.replace(/[^0-9]/g, ''); // Hapus karakter non-numerik
        const message = `Assalamu'alaikum, ${order.nama}!\n\nKami ingin mengingatkan tentang sisa pembayaran Anda sebesar Rp ${(order.total_harga - (order.dibayar || 0)).toLocaleString()}. Terima kasih!`;
        
        console.log(`Mengirim WhatsApp ke: ${waNumber}`);
        console.log(`Pesan: ${message}`);
        // sendWhatsApp(waNumber, message);
    };
    
    const stats = useMemo(() => {
        return orders.reduce((acc, order) => {
            const total = order.total_harga || 0;
            const dibayar = order.dibayar || 0;

            if (order.status === "lunas") {
                acc.lunas += total;
            } else if (order.status === "dp") {
                acc.sudahDp += dibayar;
                acc.piutang += (total - dibayar);
            } else {
                acc.belumBayar += total;
                acc.piutang += total;
            }

            // Hitung Total Item untuk XP
            // order.items.forEach(item => {
            //     acc.totalItem += item.qty || 1;
            // });

            return acc;
        }, { lunas: 0, sudahDp: 0, belumBayar: 0, piutang: 0});
    }, [orders]);

    const totalItem = orders.length
    stats.totalItem = totalItem;

    // Logika Gamifikasi (XP dan Level)
    const xpPerLevel = 10;
    const currentLevel = Math.floor(stats.totalItem / xpPerLevel) + 1;
    const progressXP = stats.totalItem % xpPerLevel

    // Daftar Top 3 Piutang Customers
    const listPiutang = orders
        .filter(order => order.status !== "lunas")
        .sort((a, b) => ((b.total - (b.dibayar || 0)) - (a.total - (a.dibayar || 0))))
        .slice(0, 3);


    return (
        <div className="space-y-8 pb-10">
            {/* SECTION: GAMIFIED HEADER */}
            <section className="bg-gradient-to-r from-green-800 to-accent-green-dark rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200">
                <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Level Warrior</p>
                    <h2 className="text-xl font-black italic">LEVEL {currentLevel}</h2>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black">{stats.totalItems}</p>
                    <p className="text-[10px] font-bold opacity-70 uppercase">Total XP (Items)</p>
                </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden border border-white/10">
                <div 
                    className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-1000"
                    style={{ width: `${progressXP * 10}%` }}
                ></div>
                </div>
                <p className="text-[10px] mt-2 font-bold text-center opacity-80">
                {xpPerLevel - progressXP} item lagi untuk naik ke Level {currentLevel + 1}! 🚀
                </p>
            </section>

        {   /* --- SECTION: MONEY STATS (RINGKAS) --- */}
            <section className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <Wallet className="text-green-500 w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Uang Aman</p>
                <p className="text-lg font-black text-slate-800">Rp {(stats.lunas + stats.sudahDp).toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-3">
                    <AlertCircle className="text-red-500 w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Piutang</p>
                <p className="text-lg font-black text-red-600">Rp {stats.piutang.toLocaleString()}</p>
                </div>
            </section>

            {/* --- SECTION: SENGGOLAN LIST (THE PRIORITY) --- */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-2">
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> Senggol Mereka
                </h3>
                <Link to={'/orders'} className="text-xs font-bold text-indigo-600">Lihat Semua</Link>
                </div>
                
                <div className="space-y-3">
                {listPiutang.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-500 uppercase">
                        {order.nama?.substring(0, 2)}
                        </div>
                        <div>
                        <h4 className="font-bold text-slate-800 text-sm">{order.nama}</h4>
                        <p className="text-[10px] text-red-500 font-bold uppercase">Sisa: Rp {(order.total_harga - (order.dibayar || 0)).toLocaleString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleSenggol(order)}
                        className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all"
                    >
                        <MessageSquare size={18} fill="currentColor" />
                    </button>
                    </div>
                ))}
                </div>
            </section>

            {/* --- SECTION: PRODUCTION SUMMARY (COLLAPSIBLE-READY) --- */}
            <section className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                <PackageCheck size={120} />
                </div>
                <div className="relative z-10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-400" /> Produk Terlaris
                </h3>
                <div className="space-y-4">
                    {/* Simple Horizontal Bar Simulation */}
                    <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Kaos Alumni</span>
                        <span>45 Pcs</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full">
                        <div className="bg-indigo-400 h-full rounded-full w-[85%]"></div>
                    </div>
                    </div>
                    <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Bingkai 20R</span>
                        <span>12 Pcs</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full">
                        <div className="bg-emerald-400 h-full rounded-full w-[40%]"></div>
                    </div>
                    </div>
                </div>
                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
                    Detail Ringkasan Produksi <ChevronRight size={14} />
                </button>
                </div>
            </section>

            {/* --- SECTION: INTERACTIVE HEATMAP --- */}
            <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Peta Kesehatan Order</h3>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-400">
                {orders.length} TOTAL
                </span>
            </div>

            {/* The Grid */}
            <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {orders.map((order) => (
                <button
                    key={order.id}
                    onClick={() => setActiveOrder(order)}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] transition-all hover:scale-125 active:scale-90 ${
                    order.status === 'lunas' ? 'bg-green-500' : 
                    order.status === 'dp' ? 'bg-yellow-400' : 'bg-red-500'
                    } ${activeOrder?.id === order.id ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                />
                ))}
            </div>

            {/* Legenda (Mungil) */}
            <div className="flex gap-3 mt-4">
                {['lunas', 'dp', 'belum'].map(status => (
                <div key={status} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <span className={`w-2 h-2 rounded-full ${status === 'lunas' ? 'bg-green-500' : status === 'dp' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                    {status}
                </div>
                ))}
            </div>

            {/* --- POPUP DETAIL (ACTIONABLE) --- */}
            {activeOrder && (
                <div className="absolute inset-x-4 -bottom-4 z-20 animate-in slide-in-from-bottom-5 duration-300">
                <div ref={popupRef} className="bg-slate-900 text-white p-5 rounded-[24px] shadow-2xl border border-white/10 relative ">
                    {/* Tombol Close Popup */}
                    <button 
                    onClick={() => setActiveOrder(null)}
                    className="absolute top-[-24px] right-0 text-black hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <h4 className="font-bold text-sm truncate uppercase">{activeOrder.nama}</h4>
                        <p className="text-[10px] text-indigo-300 font-medium">
                        {activeOrder.items?.map(i => i.product_name).join(', ')}
                        </p>
                        <p className="text-xs font-black mt-1">
                        Sisa: Rp {(activeOrder.total_harga - (activeOrder.dibayar || 0)).toLocaleString()}
                        </p>
                    </div>
                    
                    {/* Action: Langsung Senggol dari Heatmap */}
                    <button 
                        onClick={() => {
                        handleSenggol(activeOrder);
                        setActiveOrder(null); // Tutup popup setelah senggol
                        }}
                        className="flex flex-col items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-2xl transition-all active:scale-95"
                    >
                        <MessageSquare size={16} fill="currentColor" />
                        <span className="text-[8px] font-black uppercase">Senggol</span>
                    </button>
                    </div>
                </div>
                </div>
            )}
            </section>
        </div>
    );
}

export default DashboardHome;