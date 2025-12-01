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

  return (
    <div
      className={`relative w-full transition-colors duration-500 
        ${blueTheme ? "bg-[#003B73] text-white" : "bg-transparent text-black"}
      `}
    >
      <div
        className="
          flex justify-center items-center py-10
          px-6             /* mobile */
          md:px-10         /* tablet */
          lg:px-[100px]    /* ≥1280 */
          xl:px-[120px]    /* ≥1440 */
        "
      >
        <div
          className={`flex flex-col md:flex-row items-center justify-center gap-14 w-full max-w-[1400px]
            ${reversed ? "md:flex-row-reverse" : ""}
          `}
        >
          {/* TEXT */}
          <div
            className={`
              flex flex-col justify-center
              max-w-[512px]   /* tidak boleh lebih dari gambar */
              text-center md:text-left
            `}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-[42px]
                ${blueTheme ? "text-white" : "text-white"}
              `}
            >
              {title}
            </h2>

            {desc && (
              <p
                className={`text-[18px] leading-relaxed text-justify
                  ${blueTheme ? "text-white/85" : "text-white/85"}
                `}
              >
                {desc}
              </p>
            )}
          </div>

          {/* IMAGE SECTION */}
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

      {/* Chevron Left */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-0 z-20
             w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center
             hover:scale-105 transition-all"
        style={{
          marginLeft: window.innerWidth >= 1440 ? "64px" : "48px"
        }}
      >
        <ChevronLeft className="text-[#004a88]" size={20} />
      </button>

      {/* Chevron Right */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20
             w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center
             hover:scale-105 transition-all"
        style={{
          marginRight: window.innerWidth >= 1440 ? "64px" : "48px"
        }}
      >
        <ChevronRight className="text-[#004a88]" size={20} />
      </button>


      {/* DOT INDICATORS */}
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
