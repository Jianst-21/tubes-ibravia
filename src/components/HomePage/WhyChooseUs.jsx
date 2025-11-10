import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";
import houseMain from "../../assets/images/house/A.png";
import houseLeft from "../../assets/images/house/B.png";
import houseRight from "../../assets/images/house/C.png";

export const WhyChooseUs = () => {
  const features = [
    "Trusted Collaboration",
    "Wide Property Selection",
    "Secure & Transparent Process",
    "Personalized Assistance",
  ];

  const [images, setImages] = useState([houseLeft, houseMain, houseRight]);

  const handleClick = (index) => {
    if (index !== 1) {
      const newOrder = [...images];
      [newOrder[1], newOrder[index]] = [newOrder[index], newOrder[1]];
      setImages(newOrder);
    }
  };

  return (
    <section className="bg-[#003B73] text-white py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">
        {/* ================= LEFT SIDE ================= */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 text-center lg:text-left"
        >
          <h2 className="text-5xl font-extrabold mb-12 tracking-tight drop-shadow-[0_4px_5px_rgba(0,0,0,0.3)]">
            Why Choose Us
          </h2>

          <div className="space-y-7">
            {features.map((feature, index) => {
              // Ganjil: background putih, teks & check biru tua  
              // Genap: background biru tua, teks & check putih
              const isOdd = index % 2 === 0;
              const fillColor = isOdd ? "white" : "#003B73";
              const textColor = isOdd ? "#003B73" : "white";
              const circleFill = isOdd ? "white" : "transparent";

              return (
                <div
                  key={index}
                  className="flex items-center gap-5 justify-center lg:justify-start"
                >
                  {/* ICON CHECK */}
                  <div
                    className="flex items-center justify-center rounded-full border-2"
                    style={{
                      width: "55px",
                      height: "55px",
                      borderColor: textColor,
                      backgroundColor: circleFill,
                      color: textColor,
                    }}
                  >
                    <Check size={26} strokeWidth={3} />
                  </div>

                  {/* FEATURE TEXT BOX */}
                  <div
                    className="flex items-center justify-center font-semibold text-lg rounded-3xl px-7 py-3.5 min-w-[320px] shadow-[0_4px_10px_rgba(0,0,0,0.25)] border-2 border-white"
                    style={{
                      backgroundColor: fillColor,
                      color: textColor,
                    }}
                  >
                    {feature}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ================= RIGHT SIDE (CAROUSEL IMAGES) ================= */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 relative flex justify-center items-center h-[420px]"
        >
          <AnimatePresence>
            {images.map((img, index) => {
              const isCenter = index === 1;
              const className = isCenter
                ? "carousel-img center"
                : index === 0
                ? "carousel-img left"
                : "carousel-img right";

              return (
                <motion.div
                  key={img}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={className}
                  onClick={() => handleClick(index)}
                >
                  <img
                    src={img}
                    alt={`house-${index}`}
                    className="rounded-3xl border-2 border-white w-[600px] h-[420px] object-cover"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
