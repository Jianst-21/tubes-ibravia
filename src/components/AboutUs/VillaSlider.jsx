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

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

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

      {/* BUTTON LEFT */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        className={`
        cursor-pointer absolute top-1/2 -translate-y-1/2
        left-1/2 
        -translate-x-[calc(256px+32px)]     /* base: 32px */
        lg:-translate-x-[calc(256px+48px)]  /* ≥1024px: 48px */
        xl:-translate-x-[calc(256px+64px)]  /* ≥1280px: 64px */
        bg-white/40 hover:bg-white/70 text-black
        rounded-full p-2 shadow-md transition-all
      `}
      >
        <ChevronLeft size={22} />
      </button>

      {/* BUTTON RIGHT */}
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className={`
        cursor-pointer absolute top-1/2 -translate-y-1/2
        right-1/2 
        translate-x-[calc(256px+32px)]
        lg:translate-x-[calc(256px+48px)]
        xl:translate-x-[calc(256px+64px)]
        bg-white/40 hover:bg-white/70 text-black
        rounded-full p-2 shadow-md transition-all
      `}
      >
        <ChevronRight size={22} />
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
