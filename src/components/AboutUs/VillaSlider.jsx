import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const VillaSlider = ({ slides = [], reversed = false, blueTheme = false }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  const { title, desc, img } = slides[current];

  // ===== SYSTEM MODE CHECK =====
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // ===== FIXED TEXT COLOR =====
  const textColor = blueTheme 
    ? "#FFFFFF"
    : isDarkMode 
    ? "#FFFFFF"
    : "#000000";

  // ===== DOT / ICON COLOR =====
  const iconColor = blueTheme 
    ? "#FFFFFF"
    : isDarkMode
    ? "#FFFFFF"
    : "#000000";

  const dotActive = blueTheme || isDarkMode ? "#FFFFFF" : "#000000";
  const dotInactive = blueTheme || isDarkMode
    ? "rgba(255,255,255,0.4)"
    : "rgba(0,0,0,0.3)";

  return (
    <div
      className={`relative w-full transition-colors duration-500 ${
        blueTheme ? "bg-[#003B73]" : ""
      }`}
    >
      <div className="flex justify-center items-center py-10 px-6 md:px-10 lg:px-[100px] xl:px-[120px]">
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-14 w-full max-w-[1400px] ${
            reversed ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* TEXT */}
          <div className="flex flex-col justify-center max-w-[512px] text-center md:text-left">
            <h2
              className="text-3xl md:text-4xl font-bold mb-[42px]"
              style={{ color: textColor }}
            >
              {title}
            </h2>

            {desc && (
              <p
                className="text-[18px] leading-relaxed text-justify opacity-90"
                style={{ color: textColor }}
              >
                {desc}
              </p>
            )}
          </div>

          {/* IMAGE */}
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

      {/* NAV LEFT */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-0 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur shadow-md hover:scale-105 transition-all"
        style={{
          marginLeft:
            window.innerWidth >= 1440
              ? "64px"
              : window.innerWidth >= 1280
              ? "48px"
              : "16px",
          background: blueTheme
            ? "rgba(255,255,255,0.2)"
            : isDarkMode
            ? "rgba(255,255,255,0.15)"
            : "rgba(0,0,0,0.1)",
          color: iconColor,
        }}
      >
        <ChevronLeft size={24} />
      </button>

      {/* NAV RIGHT */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur shadow-md hover:scale-105 transition-all"
        style={{
          marginRight:
            window.innerWidth >= 1440
              ? "64px"
              : window.innerWidth >= 1280
              ? "48px"
              : "16px",
          background: blueTheme
            ? "rgba(255,255,255,0.2)"
            : isDarkMode
            ? "rgba(255,255,255,0.15)"
            : "rgba(0,0,0,0.1)",
          color: iconColor,
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all"
            style={{
              background: i === current ? dotActive : dotInactive,
            }}
          />
        ))}
      </div>
    </div>
  );
};
