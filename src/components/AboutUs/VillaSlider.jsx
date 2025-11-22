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
                ${blueTheme ? "bg-[#003B73] text-white" : "bg-transparent text-black"
                }`}
        >
            <div className="flex justify-center items-center py-10 px-6 md:px-10">
                <div
                    className={`flex flex-col md:flex-row items-center justify-center 
                        gap-[75px] max-w-7xl w-full ${reversed ? "md:flex-row-reverse" : ""
                        }`}
                >

                    {/* Text Section */}
                    <div className={`max-w-2xl text-center md:text-left 
                                    ${reversed ? "md:pl-24" : "md:pr-24"}
                                 `}>
                        <h2
                            className={`text-3xl md:text-4xl font-bold mb-[42px] 
                                ${blueTheme ? "text-white" : "text-[#003B73]"
                                }`}
                        >
                            {title}
                        </h2>

                        {desc && (
                            <p
                                className={`text-[18px] mb-4 leading-snug text-justify 
                                    ${blueTheme ? "text-white/80" : "text-gray-600"
                                    }`}
                            >
                                {desc}
                            </p>
                        )}
                    </div>


                    {/* Image Section */}
                    <div className="relative w-[600px] h-[420px] overflow-hidden rounded-[20px] flex-shrink-0">
                        <img
                            src={img}
                            alt={title}
                            className="w-full h-full object-cover transition-all duration-500 rounded-[20px]"
                        />
                        <div
                            className="absolute inset-0 rounded-[20px] pointer-events-none"
                            style={{
                                border: `2px solid hsl(var(--border))`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {/* Controls */}
            <button
                onClick={prevSlide}
                className="
        absolute top-1/2 -translate-y-1/2 
        p-3 md:p-4
        left-3 md:left-8
        rounded-full
        bg-black/25 hover:bg-black/40
        dark:bg-white/20 dark:hover:bg-white/40
        backdrop-blur-sm
        text-white
        transition-all shadow-lg
    "
            >
                <ChevronLeft size={18} className="md:size-22" />
            </button>

            <button
                onClick={nextSlide}
                className="
                    absolute top-1/2 -translate-y-1/2 
                    p-3 md:p-4
                    right-3 md:right-8
                    rounded-full
                    bg-black/25 hover:bg-black/40
                    dark:bg-white/20 dark:hover:bg-white/40
                    backdrop-blur-sm
                    text-white
                    transition-all shadow-lg
                "
            >
                <ChevronRight size={18} className="md:size-22" />
            </button>


            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white" : "bg-white/40"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};
