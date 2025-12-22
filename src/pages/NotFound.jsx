import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";

/**
 * Variasi Animasi Kontainer:
 * Mengatur bagaimana elemen-elemen anak (children) akan muncul.
 * staggerChildren: Memberikan jeda waktu antar elemen agar muncul bergantian (efek mengalir).
 * delayChildren: Memberikan jeda awal sebelum animasi pertama dimulai.
 */
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

/**
 * Variasi Animasi Item:
 * Mengatur pergerakan masing-masing elemen (H1, H2, P, Button).
 * Menggunakan tipe "spring" untuk memberikan efek pantulan (bounce) yang halus dan modern.
 */
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/**
 * Komponen NotFound (Halaman 404)
 * Ditampilkan ketika pengguna mencoba mengakses URL yang tidak terdaftar dalam sistem Ibravia.
 */
const NotFound = () => {
  const bluePrimary = "#2563eb"; // Warna brand utama

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      
      {/* ANIMATED MAIN: 
          Menggunakan motion.main sebagai wrapper yang menjalankan urutan animasi 
          berdasarkan variasi yang didefinisikan di atas.
      */}
      <motion.main
        className="flex-grow flex flex-col items-center justify-center px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Visual Angka 404 Besar */}
        <motion.h1
          className="text-9xl font-extrabold"
          style={{ color: bluePrimary }}
          variants={itemVariants}
        >
          404
        </motion.h1>

        {/* Pesan Kesalahan Utama */}
        <motion.h2
          className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Deskripsi bantuan bagi pengguna */}
        <motion.p className="mt-6 text-base text-gray-600 max-w-md" variants={itemVariants}>
          Sorry, the page you are looking for cannot be found. It may have been moved or the address
          may be incorrect.{" "}
        </motion.p>

        {/* Tombol Navigasi Kembali ke Beranda */}
        <motion.div variants={itemVariants} className="mt-8">
          {/* Link dari react-router-dom memastikan perpindahan halaman tanpa reload (SPA) */}
          <Link to="/">
            <motion.button
              className="px-8 py-3 text-white rounded-md font-semibold"
              style={{ backgroundColor: bluePrimary, border: "none", cursor: "pointer" }}
              // Feedback Interaktif: Membesar sedikit saat disentuh kursor
              whileHover={{ scale: 1.05, backgroundColor: "#1d4ed8" }}
              // Feedback Interaktif: Mengecil saat diklik (efek ditekan)
              whileTap={{ scale: 0.95 }}
            >
              Back to Home{" "}
            </motion.button>
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default NotFound;