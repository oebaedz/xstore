import { AlertCircle, ChevronRight, MessageSquare, PackageCheck, TrendingUp, Trophy, Wallet, X, Zap } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import sendWhatsApp from "../context/sendWhatsApp";

const DashboardHome = () => {
    const {orders = [], orderItems, products} = useOutletContext();
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

            return acc;
        }, { lunas: 0, sudahDp: 0, belumBayar: 0, piutang: 0});
    }, [orders]);

    // Gamifikasi Logic
    const totalXP = orders.length;
    const xpPerLevel = 10;
    const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;
    const progressXP = totalXP % xpPerLevel;

    const getRank = (level) => {
        const ranks = ['Newbie', 'Warrior', 'Knight', 'Master', 'Epic', 'Legend', 'Mythic', 'Immortal', 'Ascended', 'Eternal', 'Divine', 'Godlike'];
        return ranks[Math.min(level - 1, ranks.length - 1)];
    }

    // Daftar Top 3 Piutang Customers
    const listPiutang = useMemo(() => {
        return [...orders]
            .filter(order => order.status !== "lunas")
            .sort((a, b) => {
                const sisaA = a.total_harga - (a.dibayar || 0);
                const sisaB = b.total_harga - (b.dibayar || 0);
                return sisaB - sisaA;
            })
            .slice(0, 3);
    }, [orders]);

    const topProducts = useMemo(() => {
        // 1. Hitung total seluruh item yang terjual
        const totalAllItems = orderItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

        // 2. Grouping Qty per produk
        const counts = orderItems.reduce((acc, item) => {
            const id = item.product_id;
            const qty = Number(item.qty) || 0;
            acc[id] = (acc[id] || 0) + qty;
            return acc;
        }, {});

        // 3. Map ke format UI
        const result = Object.keys(counts).map(id => {
            const productInfo = products?.find(p => p.id === id);
            const qty = counts[id];
            
            // Hitung berapa persen kontribusi produk ini terhadap total jualan
            const sharePercentage = totalAllItems > 0 
            ? Math.round((qty / totalAllItems) * 100) 
            : 0;

            return {
            id,
            name: productInfo?.name || "Produk",
            totalQty: qty,
            share: sharePercentage
            };
        });

        return result.sort((a, b) => b.totalQty - a.totalQty).slice(0, 3);
    }, [orders, products]);

    return (
        <div className="p-4 space-y-8 pb-10">
            {/* SECTION: GAMIFIED HEADER */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-[2.5rem] p-5 text-white shadow-2xl shadow-emerald-200">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-xl border border-white/20">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">{getRank(currentLevel)} Rank</p>
                            <h2 className="text-2xl font-black tracking-tighter italic">LVL. {currentLevel}</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black tracking-tighter">{totalXP}</p>
                        <p className="text-[10px] font-bold opacity-60 uppercase">Total XP</p>
                    </div>
                </div>

                <div className="relative h-4 bg-black/20 rounded-full p-1 border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                        style={{ width: `${(progressXP / xpPerLevel) * 100}%` }}
                    />
                </div>
                <p className="text-[10px] mt-4 font-black text-center text-emerald-100/80 uppercase tracking-widest">
                    {xpPerLevel - progressXP} ITEMS TO REACH LEVEL {currentLevel + 1} 🚀
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

            {/* --- SECTION: PRODUCTION SUMMARY (MODERN DARK MODE) --- */}
            <section className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-7 text-white shadow-2xl">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp size={18} /> Produk Terlaris
                    </h3>

                    <div className="space-y-6">
                    {topProducts.map((prod, index) => {
                        // Hitung persentase bar (misal: dibanding produk terlaris nomor 1)
                        const maxQty = topProducts[0].totalQty + 1
                        const percentage = (prod.totalQty / maxQty) * 100;

                        return (
                        <div key={prod.id} className="space-y-3">
                            <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="block text-xs font-black uppercase text-slate-400">
                                #{index + 1} {prod.name}
                                </span>
                                <div className="flex items-center gap-2">
                                <span className="text-2xl font-black italic">{prod.totalQty}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Pcs Terjual</span>
                                </div>
                            </div>
                            {/* BADGE MARKET SHARE */}
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${index === 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : index === 1 ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
                                    {prod.share}%
                                    </span>
                                    <span className="font-light text-[10px] text-slate-500">of all sales</span>
                                </div>
                            </div>
                            {/* Bar Dinamis */}
                            <div className="relative w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                            <div 
                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                                index === 0 ? 'bg-gradient-to-r from-emerald-700 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : index === 1 ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                }`}
                                style={{ width: `${percentage}%` }}
                            />
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    
                    {/* Tombol yang tetap konsisten */}
                    <Link to='/recap' className="w-full mt-2 py-4 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    Lihat Analitik Lengkap <ChevronRight className="text-emerald-600" size={14} />
                    </Link>
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