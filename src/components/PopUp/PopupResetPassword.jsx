// PopupResetPassword.jsx
import React from "react";

/**
 * Komponen PopupResetPassword
 * Berfungsi sebagai modal sederhana untuk memberikan informasi kepada pengguna
 * mengenai status proses reset password (berhasil atau gagal).
 */
const PopupResetPassword = ({ show, message, onClose }) => {
  
  // 1. GUARD CLAUSE: Jika prop 'show' bernilai false, komponen tidak akan me-render apapun (null).
  if (!show) return null;

  return (
    /**
     * 2. OVERLAY / BACKDROP:
     * Lapisan transparan gelap yang menutupi seluruh layar (inset-0) 
     * untuk memberikan fokus penuh pada kotak modal di tengah.
     */
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      
      /**
       * 3. MODAL CONTENT:
       * Kotak putih tempat informasi ditampilkan. Menggunakan padding (p-6)
       * dan bayangan (shadow-lg) agar terlihat terangkat dari latar belakang.
       */
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        
        {/* JUDUL: Menampilkan judul pesan (misal: "Success" atau "Error") */}
        <h2 className="text-lg font-bold mb-2">{message?.title}</h2>
        
        {/* DESKRIPSI: Menampilkan detail pesan instruksi kepada pengguna */}
        <p className="text-center mb-4">{message?.text}</p>
        
        /**
         * 4. BUTTON:
         * Tombol aksi tunggal untuk menutup modal. 
         * Menggunakan fungsi 'onClose' yang dikirimkan melalui props dari komponen parent.
         */
        <button
          onClick={onClose}
          className="cursor-pointer px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PopupResetPassword;