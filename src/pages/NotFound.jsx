import { Link } from "react-router-dom"; // Ganti next/link dengan ini
import { motion } from "framer-motion";

// Variasi Animasi (Tetap sama)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

const NotFound = () => {
  const bluePrimary = "#2563eb"; // Sesuaikan kode warna Anda

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      
      {/* Kontainer Utama */}
      <motion.main 
        className="flex-grow flex flex-col items-center justify-center px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
        {/* Angka 404 */}
        <motion.h1 
          className="text-9xl font-extrabold"
          style={{ color: bluePrimary }}
          variants={itemVariants}
        >
          404
        </motion.h1>

        {/* Text Heading */}
        <motion.h2 
          className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Deskripsi */}
        <motion.p 
          className="mt-6 text-base text-gray-600 max-w-md"
          variants={itemVariants}
        >
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin sudah dipindahkan atau alamatnya salah.
        </motion.p>

        {/* Tombol Kembali */}
        <motion.div variants={itemVariants} className="mt-8">
          {/* Perhatikan: prop 'to' digunakan menggantikan 'href' */}
          <Link to="/">
            <motion.button
              className="px-8 py-3 text-white rounded-md font-semibold"
              style={{ backgroundColor: bluePrimary, border: 'none', cursor: 'pointer' }}
              whileHover={{ scale: 1.05, backgroundColor: "#1d4ed8" }}
              whileTap={{ scale: 0.95 }}
            >
              Kembali ke Beranda
            </motion.button>
          </Link>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default NotFound;