import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import Countdown from "./newcomps/Countdown";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const NewHero = ({ banners = [], deadline }) => {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-b from-primary via-[#075a45] to-[#086b52] py-16 md:py-24 overflow-hidden">
      <div className="arabesque-pattern absolute inset-0 opacity-80"></div>
      
      {/* 1. Kontainer Utama: Diubah menjadi Grid/Flex 2 kolom saat layar md */}
      <div className="relative z-2 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex md:mt-2 flex-col md:flex-row items-center gap-12">
          
          {/* KOLOM KIRI: Text & Countdown */}
          <div className="w-full md:w-1/2 text-center md:text-left order-1">
            <div className="mb-6 hidden md:block animate-fade-in">
              <img 
                src="https://i.postimg.cc/Y0ZKD30p/LOGO-NAMA-IKSADA-NEW.png" 
                alt="logo" 
                className="h-12 animate-float" 
              />
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-shimmer bg-gradient-to-r from-gold via-white to-gold bg-[length:200%_auto] bg-clip-text text-transparent">
              Koleksi Eksklusif IKSADA
            </h1>
            
            <p className="text-white/80 text-sm md:text-lg mb-8 max-w-2xl font-body font-light">
              Merchandise premium dengan sentuhan seni arsitektur Islam yang megah.
            </p>

            {/* Countdown sekarang diletakkan di bawah text agar layout seimbang */}
            <div className="mt-10">
              <Countdown deadline={deadline} />
            </div>
          </div>

          {/* KOLOM KANAN: Carousel */}
          <div className="w-full md:w-1/2 order-2">
            <Swiper
              modules={[Autoplay, Pagination, EffectCoverflow]}
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              loop={true}
              coverflowEffect={{
                rotate: 5,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: false,
              }}
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="pb-12"
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={index} className="max-w-[210px] md:max-w-[320px]">
                  {/* 2. Koreksi Tinggi: Menggunakan aspect-ratio tetap & object-cover agar gambar seragam */}
                  <div 
                    onClick={() => setSelectedImg(banner)}
                    className="cursor-zoom-in group relative overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border border-gold/20"
                  >
                    <img 
                      src={banner} 
                      alt='catalogue'
                      // h-[400px] atau aspect-square memastikan tinggi selalu sama meski file asli beda ukuran
                      className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white bg-gold/80 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm">View Poster</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* --- MODAL LIGHTBOX --- */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setSelectedImg(null)}
        >
          <img 
            src={selectedImg} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-zoom-in"
          />
        </div>
      )}

      {/* 3. Koreksi Lain: Pindahkan style ke tag standar tanpa atribut 'global' untuk Vite */}
      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet { background: #EBD197 !important; }
        .animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </section>
  );
};

export default NewHero;