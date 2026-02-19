import Countdown from "./newcomps/Countdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Link } from "react-router-dom";
import pic from "../assets/catalog.jpg";

const NewHero = () => {
  const banners = [
    pic,
    pic,
    pic,
  ];

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
        {/* Main Logo */}
        <div className="mb-8 hidden md:block animate-fade-in">
          <div className="w-16 h-16 md:w-32 md:h-32 mx-auto mb-6 animate-float">
            <img src="https://i.postimg.cc/Y0ZKD30p/LOGO-NAMA-IKSADA-NEW.png" alt="logo" className="h-12 md:h-20 mx-auto animate-float" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="font-display mt-16 text-2xl md:text-6xl font-bold mb-4 animate-shimmer bg-gradient-to-r from-gold via-white to-gold bg-[length:200%_auto] bg-clip-text text-transparent">
          Koleksi Eksklusif IKSADA
        </h1>
        
        <p className="text-white/80 text-sm md:text-xl mb-8 max-w-2xl mx-auto font-body font-light">
          Merchandise premium dengan sentuhan seni kaligrafi dan desain arsitektur Islam yang megah.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
          </svg>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>

        {/* Floating Carousel Section */}
        <div className="relative w-full max-w-2xl mx-auto mb-8 lg:hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              320: { spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 2.5, spaceBetween: 40 },
            }}
            className="pb-12"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index} className="max-w-[200px] md:max-w-[500px] text-gold space-x-4">
                <Link 
                  to={'/'} 
                  className="block group relative overflow-hidden rounded-2xl md:rounded-3xl border border-gold/90">
                    <img src={banner} alt={`Banner ${index + 1}`} className="w-full object-contain rounded-xl shadow-lg transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
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