import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

// Images
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

  // === Smooth slide animation, no cropping, no shrinking ===
  const slideVariants = {
    center: {
      x: 0,
      scale: 1,
      filter: "brightness(1)",
      zIndex: 10,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    left: {
      x: "-140px",
      scale: 0.9,
      filter: "brightness(0.85)",
      zIndex: 5,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    right: {
      x: "140px",
      scale: 0.9,
      filter: "brightness(0.85)",
      zIndex: 5,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[#003B73] text-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">

        {/* ================= LEFT ================= */}
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
              const isOdd = index % 2 === 0;
              const fillColor = isOdd ? "white" : "#003B73";
              const textColor = isOdd ? "#003B73" : "white";
              const circleFill = isOdd ? "white" : "transparent";

              return (
                <div
                  key={index}
                  className="flex items-center gap-5 justify-center lg:justify-start"
                >
                  {/* ICON */}
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

                  {/* BOX */}
                  <div
                    className="flex items-center justify-center font-semibold text-lg 
                    rounded-3xl px-7 py-3.5 min-w-[320px] shadow-[0_4px_10px_rgba(0,0,0,0.25)] border-2 border-white"
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

        {/* ================= RIGHT (CAROUSEL) ================= */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 relative flex justify-center items-center h-[450px] overflow-visible"
        >
          <AnimatePresence>
            {images.map((img, index) => {
              return (
                <motion.div
                  key={img}
                  variants={slideVariants}
                  animate={
                    index === 1 ? "center" : index === 0 ? "left" : "right"
                  }
                  onClick={() => handleClick(index)}
                  className="absolute cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`house-${index}`}
                    className="rounded-3xl border-2 border-white w-[430px] h-[280px] object-cover shadow-xl"
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
