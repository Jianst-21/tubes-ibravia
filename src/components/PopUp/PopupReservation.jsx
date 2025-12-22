import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

/**
 * Komponen PopupReservation
 * Menampilkan pesan sukses setelah pengguna berhasil membuat reservasi rumah.
 * Menggunakan framer-motion untuk animasi masuk/keluar dan Tailwind CSS untuk styling.
 */
export default function PopupReservation({ show, onClose }) {
  const navigate = useNavigate();

  /**
   * Fungsi handleHome
   * Menjalankan dua aksi: menutup modal melalui prop onClose dan 
   * mengarahkan pengguna kembali ke halaman utama (Home).
   */
  const handleHome = () => {
    onClose(); 
    navigate("/"); 
  };

  return (
    /**
     * AnimatePresence digunakan untuk memungkinkan komponen menjalankan animasi 
     * keluar (exit) sebelum benar-benar dihapus dari pohon DOM.
     */
    <AnimatePresence>
      {show && (
        /**
         * Overlay/Backdrop: Lapisan hitam transparan di belakang popup.
         * Memberikan efek blur pada latar belakang agar pengguna fokus pada modal.
         */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          /**
           * Modal Content: Kontainer utama pesan sukses.
           * Memiliki animasi scale (membesar) saat muncul agar terlihat lebih dinamis.
           */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl px-10 py-12 text-center max-w-lg w-[90%]"
          >
            {/* Representasi Visual: Ikon centang besar sebagai tanda keberhasilan */}
            <div className="flex justify-center mb-6">
              <Check className="w-20 h-20 text-blue-800" strokeWidth={3} />
            </div>

            {/* Pesan Teks: Judul dan Detail instruksi selanjutnya untuk pengguna */}
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Thank You</h2>
            <p className="text-lg font-semibold mb-4 text-gray-800">
              Your Reservation is Successful
            </p>
            <p className="text-gray-600 text-justify text-sm mb-8 leading-relaxed">
              Thank you for your successful reservation with Ibravia. Your reservation request has
              been received. Our team will reach out to you shortly to arrange a house visit. Don’t
              forget to confirm within 7 days once we contact you.
            </p>

            {/* Tombol Aksi: Mengarahkan pengguna kembali ke Home */}
            <button
              onClick={handleHome}
              className="cursor-pointer bg-[#007BFF] hover:bg-[#006AE0] text-white px-6 py-2 
              rounded-md font-medium shadow-md transition"
            >
              Home
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}