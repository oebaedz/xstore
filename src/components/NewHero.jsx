import Countdown from "./newcomps/Countdown";

const NewHero = () => {
  return (
    <section className="relative flex-1 flex flex-col justify-center bg-gradient-to-b from-primary via-[#075a45] to-[#086b52] py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="arabesque-pattern absolute inset-0 opacity-30"></div>
      
      {/* Floating Ornaments (Kiri & Kanan) */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-20 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" fill="none" stroke="#EBD197" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-10 w-16 h-16 opacity-20 animate-float animation-delay-500">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" fill="none" stroke="#EBD197" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-1 max-w-5xl mx-auto px-4 text-center">
        {/* Main Logo - Mosque Dome */}
        <div className="mb-8 animate-fade-in">
          <div className="w-16 h-16 md:w-32 md:h-32 mx-auto mb-6 animate-float">
            <img src="https://i.postimg.cc/Y0ZKD30p/LOGO-NAMA-IKSADA-NEW.png" alt="logo" className="h-10 animate-fade-in" />
            {/* <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
              <circle cx="60" cy="60" r="55" fill="none" stroke="#EBD197" strokeWidth="0.5" opacity="0.5" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#EBD197" strokeWidth="1" />
              <path d="M60 25 Q82 45 82 65 L38 65 Q38 45 60 25Z" fill="none" stroke="#EBD197" strokeWidth="2" />
              <circle cx="60" cy="22" r="4" fill="#EBD197" />
              <rect x="30" y="50" width="6" height="25" fill="none" stroke="#EBD197" strokeWidth="1.5" />
              <rect x="84" y="50" width="6" height="25" fill="none" stroke="#EBD197" strokeWidth="1.5" />
              <path d="M95 30 A12 12 0 1 1 95 54 A9 9 0 1 0 95 30Z" fill="#EBD197" />
              <rect x="35" y="65" width="50" height="5" fill="none" stroke="#EBD197" strokeWidth="1.5" />
            </svg> */}
          </div>
        </div>

        {/* Text Content */}
        <h1 className="font-display text-2xl md:text-6xl font-bold mb-4 animate-shimmer bg-gradient-to-r from-gold via-white to-gold bg-[length:200%_auto] bg-clip-text text-transparent">
          Koleksi Eksklusif IKSADA
        </h1>
        
        <p className="text-white/80 text-sm md:text-xl mb-10 max-w-2xl mx-auto font-body font-light">
          Merchandise premium dengan sentuhan seni kaligrafi dan desain arsitektur Islam yang megah.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-10 opacity-70">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
          </svg>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>

        {/* CTA Button */}
        {/* <button className="bg-action text-xs hover:bg-green-700 text-white font-semibold px-10 py-4 rounded-sm tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(235,209,151,0.3)] hover:shadow-accent/40 active:scale-95 uppercase">
          Lihat Koleksi Eksklusif
        </button> */}
        <Countdown />
      </div>
    </section>
  );
};

export default NewHero;