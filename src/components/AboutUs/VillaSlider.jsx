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

  const { title, desc, img } = slides[current];

  return (
    <div
      className={`relative w-full transition-colors duration-500 
      ${blueTheme ? "bg-[#003B73] text-white" : "bg-transparent text-black"}`}
    >
      <div className="flex justify-center items-center py-16">
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-[75px] max-w-7xl w-full
          ${reversed ? "md:flex-row-reverse" : ""}`}
        >
          {/* TEXT */}
          <div
            className={`max-w-2xl text-center md:text-left
            px-6 
            lg:px-[100px]     /* ≥1280px: margin text = 100px */
            xl:px-[120px]     /* ≥1440px: margin text = 120px */
          `}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-[42px]
              ${blueTheme ? "text-white" : "text-[#003B73]"}`}
            >
              {title}
            </h2>

            {desc && (
              <p
                className={`text-[18px] leading-snug text-justify
                ${blueTheme ? "text-white/80" : "text-gray-600"}`}
              >
                {desc}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div className="relative w-[512px] h-[344px] rounded-[20px] overflow-hidden flex-shrink-0">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover rounded-[20px]"
            />
            <div
              className="absolute inset-0 rounded-[20px] pointer-events-none"
              style={{ border: `2px solid hsl(var(--border))` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chevron Left */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-0 z-20
             transform hover:scale-105 transition-all"
        style={{
          marginLeft: window.innerWidth >= 1440 ? "64px" : "48px"
        }}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Chevron Right */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20
             transform hover:scale-105 transition-all"
        style={{
          marginRight: window.innerWidth >= 1440 ? "64px" : "48px"
        }}
      >
        <ChevronRight size={24} />
      </button>


      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all 
            ${i === current ? "bg-white" : "bg-white/40"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
