import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";
import houseMain from "../../assets/images/house/A.png";
import houseLeft from "../../assets/images/house/B.png";
import houseRight from "../../assets/images/house/C.png";

/**
 * Komponen WhyChooseUs
 * Menampilkan keunggulan layanan Ibravia dengan elemen visual interaktif.
 * Terdapat list fitur di sisi kiri dan carousel gambar yang bisa ditukar di sisi kanan.
 */
export const WhyChooseUs = () => {
  // 1. DATA: Daftar keunggulan yang akan ditampilkan sebagai poin-poin
  const features = [
    "Trusted Collaboration",
    "Wide Property Selection",
    "Secure & Transparent Process",
    "Personalized Assistance",
  ];

  // 2. STATE: Mengelola urutan gambar dalam carousel
  const [images, setImages] = useState([houseLeft, houseMain, houseRight]);

  /**
   * 3. HANDLER: Fungsi untuk menukar gambar
   * Jika gambar di sisi kiri atau kanan diklik, gambar tersebut akan bertukar posisi dengan gambar tengah.
   */
  const handleClick = (index) => {
    if (index !== 1) { // Hanya proses jika yang diklik bukan gambar tengah
      const newOrder = [...images];
      [newOrder[1], newOrder[index]] = [newOrder[index], newOrder[1]]; // Logika swap array
      setImages(newOrder);
    }
  };

  return (
    <section className="bg-[#003B73] text-white py-20 px-4 md:px-6 lg:px-[80px] xl:px-[120px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">
        
        {/* SISI KIRI: Bagian Teks dan Daftar Fitur */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 text-center lg:text-left"
        >
          <h2 className="text-[54px] font-extrabold mb-12 tracking-tight drop-shadow-[0_4px_5px_rgba(0,0,0,0.3)]">
            Why Choose Us
          </h2>

          <div className="space-y-7">
            {features.map((feature, index) => {
              // Logika pewarnaan selang-seling (Zebra pattern) untuk list fitur
              const isOdd = index % 2 === 0;
              const fillColor = isOdd ? "white" : "#003B73";
              const textColor = isOdd ? "#003B73" : "white";
              const circleFill = isOdd ? "white" : "transparent";

              return (
                <div
                  key={index}
                  className="flex items-center gap-5 justify-center lg:justify-start"
                >
                  {/* Ikon Check dengan style dinamis */}
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

                  {/* Label Fitur dengan style dinamis */}
                  <div
                    className="flex items-center justify-center font-semibold text-[20px] 
                    rounded-[20px] px-7 py-3.5 min-w-[330px] shadow-[0_4px_10px_rgba(0,0,0,0.25)] border-2 border-white"
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

        {/* SISI KANAN: Carousel Gambar Interaktif */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 relative flex justify-center items-center"
        >
          <AnimatePresence>
            {images.map((img, index) => {
              const isCenter = index === 1;

              // Pengaturan dimensi dan posisi gambar berdasarkan urutan array
              const style = {
                width: isCenter ? 472 : 304,    // Gambar tengah lebih besar
                height: isCenter ? 304 : 232,   // Gambar samping lebih kecil
                x: isCenter ? 0 : index === 0 ? -130 : 130, // Geser kiri/kanan
                zIndex: isCenter ? 30 : 20,     // Gambar tengah selalu di depan
              };

              return (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, x: style.x }}
                  animate={{ opacity: 1, x: style.x, zIndex: style.zIndex }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute cursor-pointer"
                  onClick={() => handleClick(index)}
                >
                  <img
                    src={img}
                    alt={`house-${index}`}
                    style={{
                      width: style.width,
                      height: style.height,
                    }}
                    className="rounded-[20px] border-2 border-white object-cover shadow-lg"
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