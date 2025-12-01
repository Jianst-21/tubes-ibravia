import { useState, useRef } from "react";
import { VillaButton } from "../GlobalPage/VillaButton";
import { VillaSlider } from "./VillaSlider";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const VillaSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sliderRef = useRef(null);

  const villas = [
    {
      id: "V001",
      name: "Villa Ijen Nebraska",
      desc: "Villa premium dengan pemandangan pegunungan...",
      image: "https://via.placeholder.com/500",
    },
    {
      id: "V002",
      name: "Villa Hijau Tropika",
      desc: "Suasana tropis dengan udara sejuk...",
      image: "https://via.placeholder.com/500",
    },
    {
      id: "V003",
      name: "Villa City Resort",
      desc: "Dekat pusat kota dan fasilitas lengkap...",
      image: "https://via.placeholder.com/500",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentVilla = villas[activeIndex];

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? villas.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === villas.length - 1 ? 0 : prev + 1));
  };

  const isBlueBg = true; // jika nanti kamu mau ganti background putih → ubah false

  return (
    <section
      className={`
        w-full py-16 md:py-20 transition-colors duration-500
        ${isBlueBg ? "bg-[#003B73]" : "bg-transparent"}
      `}
    >
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Text Content */}
        <div>
          <h2
            className={`
              text-3xl md:text-4xl font-bold mb-[18px]
              ${isBlueBg ? "text-white" : "text-black dark:text-white"}
            `}
          >
            {currentVilla.name}
          </h2>

          {currentVilla.desc && (
            <p
              className={`
                text-[18px] leading-relaxed mb-6 md:mb-10 text-justify
                ${isBlueBg ? "text-white" : "text-black dark:text-white"}
              `}
            >
              {currentVilla.desc}
            </p>
          )}

          <VillaButton text="View Villa" />
        </div>

        {/* Right Slider */}
        <div className="relative">
          <VillaSlider villa={currentVilla} />

          {/* Chevron Left */}
          <button
            onClick={prevSlide}
            className={`absolute top-1/2 -translate-y-1/2 left-2 z-20
              w-10 h-10 rounded-full flex items-center justify-center
              backdrop-blur shadow-md hover:scale-105 transition-all
              ${
                isBlueBg
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-black/20 text-black hover:bg-black/40 dark:bg-white/20 dark:text-white dark:hover:bg-white/40"
              }
            `}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Chevron Right */}
          <button
            onClick={nextSlide}
            className={`absolute top-1/2 -translate-y-1/2 right-2 z-20
              w-10 h-10 rounded-full flex items-center justify-center
              backdrop-blur shadow-md hover:scale-105 transition-all
              ${
                isBlueBg
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-black/20 text-black hover:bg-black/40 dark:bg-white/20 dark:text-white dark:hover:bg-white/40"
              }
            `}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
