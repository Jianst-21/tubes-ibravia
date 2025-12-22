import React from "react";

/**
 * Komponen PopupResetPasswordSuccess
 * Digunakan khusus untuk menampilkan notifikasi sukses setelah user berhasil memperbarui password.
 * Memiliki struktur yang ringan dan fokus pada pesan konfirmasi.
 */
const PopupResetPasswordSuccess = ({ show, message, onClose }) => {
  
  // 1. GUARD CLAUSE: Logika untuk mencegah rendering komponen jika status 'show' adalah false.
  if (!show) return null;

  return (
    /**
     * 2. BACKDROP / OVERLAY:
     * Menggunakan posisi 'fixed' dan 'inset-0' untuk menutupi seluruh layar.
     * 'bg-black/50' memberikan efek gelap transparan di belakang modal.
     */
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      
      /**
       * 3. MODAL CONTAINER:
       * Pembungkus konten dengan latar putih, sudut membulat (rounded-lg), 
       * dan bayangan untuk memberikan efek kedalaman (shadow-lg).
       */
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        
        {/* JUDUL PESAN: Menampilkan judul utama dari objek message */}
        <h2 className="text-lg font-bold mb-2">{message?.title}</h2>
        
        {/* DESKRIPSI PESAN: Menampilkan detail informasi sukses kepada pengguna */}
        <p className="mb-4">{message?.text}</p>
        
        /**
         * 4. TOMBOL KONFIRMASI:
         * Tombol tunggal untuk menutup popup.
         * Menjalankan fungsi 'onClose' yang biasanya berisi logika untuk mengarahkan user kembali ke Login.
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

export default PopupResetPasswordSuccess;