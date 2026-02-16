// App.jsx atau LandingPage.jsx
import { useEffect, useState } from 'react';

function Nyoba() {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 59,
    seconds: 28,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { seconds = 59; minutes--; }
        else if (hours > 0) { seconds = 59; minutes = 59; hours--; }
        else if (days > 0) { seconds = 59; minutes = 59; hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a3525] text-white font-sans relative overflow-hidden">
      {/* Background subtle pattern / gradient jika ada di Canva */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a3525] via-[#0c3a2a] to-[#082c1f] opacity-90"></div>

      {/* Ornamen bintang kecil tersebar */}
      <div className="absolute top-10 left-10 text-5xl opacity-30">✦</div>
      <div className="absolute top-20 right-12 text-4xl opacity-40">★</div>
      <div className="absolute bottom-16 left-16 text-6xl opacity-20">✧</div>
      <div className="absolute bottom-24 right-20 text-5xl opacity-25">★</div>

      <div className="relative z-10 px-4 pt-16 pb-24 text-center max-w-4xl mx-auto">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-5xl">🕌</div> {/* Ganti dengan SVG masjid jika ada */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider">
              IKSADA STOREE
            </h1>
          </div>
          <p className="text-emerald-300 text-lg md:text-xl tracking-widest font-medium">
            PREMIUM ISLAMIC COLLECTION
          </p>
        </div>

        {/* Garis emas atas */}
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4"></div>

        {/* Emblem Lingkaran Tengah */}
        <div className="mx-auto w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-amber-500/30 flex items-center justify-center mb-10 relative shadow-2xl">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-amber-400/40 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-7xl md:text-9xl mb-2">🕌</div>
              <div className="text-xs md:text-sm opacity-90 tracking-wider">Masjid</div>
            </div>
          </div>
        </div>

        {/* Judul Utama */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-wide">
          Koleksi Ekslusif Islami
        </h2>

        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-90">
          Merchandise premium dengan sentuhan seni kaligrafi dan desain
          <br />
          arsitektur Islam yang megah
        </p>

        {/* Tombol CTA Persis */}
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 px-16 rounded-lg text-xl tracking-wider shadow-lg shadow-black/40 transition-all duration-300 mx-auto block">
          LIHAT KOLEKSI EKSKLUSIF
        </button>

        {/* Ornamen bintang di bawah tombol */}
        <div className="flex justify-center items-center gap-6 my-10 text-4xl opacity-50">
          <span>★</span>
          <span className="text-amber-300">★</span>
          <span>★</span>
        </div>

        {/* Countdown Section */}
        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-semibold mb-8 tracking-wide">
            Pre-Order Ditutup Dalam
          </h3>

          <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
            {[
              { value: timeLeft.days, label: 'HARI' },
              { value: timeLeft.hours, label: 'JAM' },
              { value: timeLeft.minutes, label: 'MENIT' },
              { value: timeLeft.seconds, label: 'DETIK' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0c3a2a] border border-amber-600/40 rounded-xl w-24 md:w-32 h-24 md:h-32 flex flex-col items-center justify-center shadow-inner shadow-black/50 backdrop-blur-sm"
              >
                <div className="text-5xl md:text-6xl font-bold text-amber-300 tracking-tight">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base mt-2 tracking-widest opacity-80 uppercase">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garis emas bawah */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mt-16"></div>
      </div>

      {/* Bottom Bar (mobile navigation icons - Nyobaroximate) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-amber-900/30 py-3 px-6 flex justify-around text-white md:hidden z-50">
        <div className="flex flex-col items-center text-xs">
          <span className="text-2xl">🏠</span>
          <span>Home</span>
        </div>
        <div className="flex flex-col items-center text-xs">
          <span className="text-2xl">📖</span>
          <span>Menu</span>
        </div>
        <div className="flex flex-col items-center text-xs">
          <span className="text-2xl">🔍</span>
          <span>Search</span>
        </div>
        <div className="flex flex-col items-center text-xs">
          <span className="text-2xl">⋯</span>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default Nyoba;