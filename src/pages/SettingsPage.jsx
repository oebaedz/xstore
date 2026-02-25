import { AppWindow, Calendar, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import supabase from "../components/createClient";

export default function SettingsPage() {
    const { appSettings, refreshData } = useOutletContext();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('jadwal'); // 'jadwal' or 'tampilan'
    const [poSchedule, setPoSchedule] = useState({ end_date: '', status: 'closed' });
    const [carouselImages, setCarouselImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (appSettings.length === 0) return; // Pastikan data sudah ada

        const carousel = appSettings.find(s => s.key === 'hero_carousel');
        const schedule = appSettings.find(s => s.key === 'po_schedule');
        if(carousel) setCarouselImages(carousel.value)
        if(schedule) setPoSchedule(schedule.value)
    }, [appSettings]);
    
    const handleRemoveImage = async (index) => {
        setLoading(true);
        const updatedImages = carouselImages.filter((_, idx) => idx !== index);
        setCarouselImages(updatedImages);
        try {
            const { error } = await supabase.from('app_settings')
                .update({ value: updatedImages })
                .eq('key', 'hero_carousel');
            if (error) throw error;
            showToast('Foto berhasil dihapus dari carousel.', 'success');
            refreshData(); // Refresh data to reflect changes
        }
        catch (err) {
            console.error('Error removing image from carousel:', err);
            showToast('Gagal menghapus foto dari carousel.', 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleSaveJadwal = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('app_settings')
                .update({ value: poSchedule })
                .eq('key', 'po_schedule');
            if (error) throw error;
            showToast('Jadwal PO berhasil disimpan!', 'success');
            refreshData(); // Refresh data to reflect changes
        }
        catch (err) {
            console.error('Error saving PO schedule:', err);
            showToast('Gagal menyimpan jadwal PO.', 'error');
        } finally {
            setLoading(false);
        }
    }

// Render Menu Navigasi
    return (
        <div className="p-4">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                <button 
                    onClick={() => setActiveTab('jadwal')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'jadwal' ? 'bg-white shadow-sm text-emerald-500' : 'text-slate-400'}`}
                >
                    <Calendar className="inline mr-1" size={14} /> Jadwal PO
                </button>
                <button 
                    onClick={() => setActiveTab('tampilan')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'tampilan' ? 'bg-white shadow-sm text-emerald-500' : 'text-slate-400'}`}
                >
                    <AppWindow className="inline mr-1" size={14} /> Tampilan
                </button>
            </div>

            {activeTab === 'jadwal' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                        Batas Akhir Pemesanan
                    </label>
                    
                    {/* Date Picker Input */}
                    <input 
                        type="datetime-local" 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 mb-4"
                        value={poSchedule.end_date}
                        onChange={(e) => setPoSchedule({...poSchedule, end_date: e.target.value})}
                    />

                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <div>
                        <p className="text-xs font-bold text-emerald-900">Status Toko</p>
                        <p className="text-[10px] text-emerald-500 font-medium">Buka/Tutup PO secara manual</p>
                        </div>
                        <button 
                        onClick={() => setPoSchedule({...poSchedule, status: poSchedule.status === 'open' ? 'closed' : 'open'})}
                        className={`w-14 h-8 rounded-full transition-all relative ${poSchedule.status === 'open' ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${poSchedule.status === 'open' ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <button 
                    onClick={handleSaveJadwal} 
                    disabled={loading}
                    className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                        Simpan Perubahan Jadwal
                    </button>
                    </div>
                </div>
            )}

            {activeTab === 'tampilan' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Poster Hero Carousel
                        </label>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {carouselImages.length} Foto
                        </span>
                    </div>

                    {/* Image Preview List */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {carouselImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group">
                            <img src={img} className="w-full h-full object-cover" alt="Preview" />
                            <button 
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg scale-0 group-hover:scale-100 transition-transform"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        ))}
                        
                        {/* Tombol Tambah (Placeholder) */}
                        <button className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                            <Plus size={20} />
                            <span className="text-[9px] font-bold uppercase mt-1">Tambah Foto</span>
                        </button>
                    </div>

                    <p className="text-[9px] text-slate-400 italic">
                        *Disarankan menggunakan rasio 16:9 dengan ukuran file di bawah 1MB.
                    </p>
                    </div>
                </div>
                )}
        </div>
    );
}