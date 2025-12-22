import { motion, AnimatePresence } from "framer-motion";

/**
 * Komponen PopupSignup
 * Ditampilkan setelah pengguna mengisi formulir pendaftaran.
 * Memberikan instruksi verifikasi OTP melalui email menggunakan animasi halus.
 */
const PopupSignup = ({ show, message, onClose }) => {
  return (
    /**
     * 1. ANIMATE PRESENCE:
     * Memungkinkan elemen di dalamnya untuk menjalankan animasi 'exit' 
     * sebelum benar-benar dihilangkan dari pohon DOM.
     */
    <AnimatePresence>
      {show && (
        /**
         * 2. BACKDROP / OVERLAY:
         * Menutupi seluruh layar dengan warna hitam transparan (bg-black/40).
         * Menjalankan animasi fade-in (opacity 0 ke 1).
         */
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          /**
           * 3. MODAL CONTENT:
           * Kontainer putih tempat pesan ditampilkan.
           * Menggunakan animasi scale (0.9 ke 1) agar memberikan efek muncul yang membal.
           */
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 text-center max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* JUDUL: Menampilkan judul dari props atau default "Success!" */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {message?.title || "Success!"}
            </h2>

            {/* PESAN: Menampilkan teks instruksi OTP atau pesan default */}
            <p className="text-gray-600 mb-6">
              {message?.text || "The OTP has been sent to your email. Please Verify your account!"}
            </p>

            {/* TOMBOL KONFIRMASI: Menutup popup saat diklik */}
            <button
              onClick={onClose}
              className="cursor-pointer bg-primary text-white px-5 py-2 rounded-md 
              hover:opacity-90 transition-all duration-200"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupSignup;