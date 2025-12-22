import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen VillaSlider
 * Digunakan untuk menampilkan konten properti dalam bentuk carousel/slider.
 * Mendukung fitur autoplay, navigasi manual, dan tema warna dinamis.
 */
export const VillaSlider = ({ slides = [], reversed = false, blueTheme = false }) => {
  // 1. STATE: Menyimpan index slide yang sedang aktif
  const [current, setCurrent] = useState(0);

  // 2. AUTOPLAY EFFECT: Mengganti slide secara otomatis setiap 15 detik.
  // clearInterval digunakan untuk membersihkan timer saat komponen tidak lagi digunakan (unmount).
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Early return jika data slides kosong untuk menghindari error
  if (!slides.length) return null;

  // 3. NAVIGATION FUNCTIONS: Fungsi untuk berpindah slide secara manual (kiri/kanan).
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  // Mengambil data slide (judul, deskripsi, gambar) berdasarkan index 'current'
  const { title, desc, img } = slides[current];

  return (
    <div
      className={`relative w-full transition-colors duration-500 
      ${blueTheme ? "bg-[#003B73]" : "bg-background text-foreground"}`}
    >
      <div className="flex justify-center items-center py-10 px-6 md:px-10 lg:px-[100px] xl:px-[120px]">
        {/* 4. LAYOUT WRAPPER: Menangani arah konten (reversed atau normal) */}
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-14 w-full max-w-[1400px]
          ${reversed ? "md:flex-row-reverse" : ""}
          `}
        >
          {/* 5. TEXT SECTION: Menampilkan judul dan deskripsi slide */}
          <div
            className={`flex flex-col justify-center max-w-[512px] text-center md:text-left 
            ${blueTheme ? "text-white" : ""}`}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-[42px] 
              ${blueTheme ? "text-white" : ""}`}
            >
              {title}
            </h2>

            {desc && (
              <p
                className={`text-[18px] leading-relaxed text-justify 
                ${blueTheme ? "text-white/90" : "text-muted-foreground"}`}
              >
                {desc}
              </p>
            )}
          </div>

          {/* 6. IMAGE SECTION: Menampilkan gambar utama properti */}
          <div className="relative flex-shrink-0">
            <div className="w-[512px] max-w-full aspect-[512/344] overflow-hidden rounded-2xl">
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover rounded-2xl transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. NAVIGATION BUTTON (LEFT): Tombol panah kiri dengan posisi responsif */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 -translate-y-1/2 left-0 z-20 
        w-10 h-10 rounded-full flex items-center justify-center 
        backdrop-blur shadow-md hover:scale-105 transition-all 
        ${blueTheme ? "bg-white/20 text-white" : "bg-background/30 text-foreground"}`}
        style={{
          marginLeft:
            window.innerWidth >= 1440 ? "64px" : window.innerWidth >= 1280 ? "48px" : "16px",
        }}
      >
        <ChevronLeft size={24} />
      </button>

      {/* 8. NAVIGATION BUTTON (RIGHT): Tombol panah kanan dengan posisi responsif */}
      <button
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 right-0 z-20 
        w-10 h-10 rounded-full flex items-center justify-center 
        backdrop-blur shadow-md hover:scale-105 transition-all 
        ${blueTheme ? "bg-white/20 text-white" : "bg-background/30 text-foreground"}`}
        style={{
          marginRight:
            window.innerWidth >= 1440 ? "64px" : window.innerWidth >= 1280 ? "48px" : "16px",
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* 9. INDICATOR DOTS: Menampilkan titik navigasi di bagian bawah slider */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all 
            ${
              i === current
                ? blueTheme
                  ? "bg-white"
                  : "bg-primary"
                : blueTheme
                  ? "bg-white/40"
                  : "bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};