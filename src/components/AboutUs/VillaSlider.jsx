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
        ${blueTheme ? "bg-[#003B73] text-white" : "bg-transparent text-white"}
      `}
    >
      <div
        className="
        flex justify-center items-center py-10
        px-6 md:px-10 lg:px-[100px] xl:px-[120px]
      "
      >
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-14 w-full max-w-[1400px]
            ${reversed ? "md:flex-row-reverse" : ""}
          `}
        >
          {/* TEXT */}
          <div className="flex flex-col justify-center max-w-[512px] text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-[42px]">
              {title}
            </h2>

            {desc && (
              <p className="text-[18px] leading-relaxed text-white/85 text-justify">
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

      {/* Chevron Base Style */}
      {[
        { side: "left", action: prevSlide, Icon: ChevronLeft },
        { side: "right", action: nextSlide, Icon: ChevronRight }
      ].map(({ side, action, Icon }) => (
        <button
          key={side}
          onClick={action}
          className={`
          absolute top-1/2 -translate-y-1/2 z-20
          w-10 h-10 rounded-full flex items-center justify-center
          shadow-md transition-all backdrop-blur cursor-pointer
          ${side === "left" ? "xl:-translate-x-[64px] lg:-translate-x-[48px] -translate-x-[16px]" : ""}
          ${side === "right" ? "xl:translate-x-[64px] lg:translate-x-[48px] translate-x-[16px]" : ""}
          ${blueTheme
              ? "bg-white/20 text-white hover:bg-white/40"
              : "bg-white/20 text-white hover:bg-white/40"
            }
        `}
        >
          <Icon size={20} />
        </button>
      ))}

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all
              ${i === current ? "bg-white" : "bg-white/40"}
            `}
          />
        ))}
      </div>
    </div>
  );
};
