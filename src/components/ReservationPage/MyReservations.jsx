import { useEffect, useState } from "react";
import axios from "axios";
import ReservationCard from "./ReservationCard";

/**
 * Komponen MyReservations
 * Berfungsi untuk menampilkan daftar seluruh reservasi yang telah dilakukan oleh pengguna (Customer).
 * Komponen ini mengambil data dari API berdasarkan ID pengguna yang tersimpan di LocalStorage.
 */
export default function MyReservations() {
  // 1. STATE MANAGEMENT
  const [reservations, setReservations] = useState([]); // Menyimpan array data reservasi dari server
  const [loading, setLoading] = useState(true);        // Menangani status tampilan saat data sedang dimuat
  
  // Mengambil data user untuk pengecekan awal (seperti ID User)
  const user = JSON.parse(localStorage.getItem("user"));

  /**
   * 2. EFFECT: Menjalankan proses pengambilan data saat komponen pertama kali muncul.
   */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return; // Hentikan jika tidak ada data user (belum login)

    /**
     * 3. FUNGSI ASYNC: fetchReservations
     * Melakukan request GET ke backend Ibravia untuk mengambil riwayat reservasi milik user tertentu.
     */
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/reservations/user/${storedUser.id_user}`,
          { withCredentials: true } // Memastikan cookie/session terkirim jika diperlukan
        );
        // Simpan data reservasi ke dalam state
        setReservations(res.data.reservations || []);
      } catch (err) {
        console.error(" Gagal mengambil data reservasi:", err);
        setReservations([]); // Set array kosong jika terjadi error
      } finally {
        // Matikan indikator loading baik request berhasil maupun gagal
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  /**
   * 4. CONDITIONAL RENDERING: Pengecekan Keamanan (Auth)
   * Jika user mencoba akses tanpa login, tampilkan pesan peringatan.
   */
  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Silakan login untuk melihat reservasi Anda.
      </p>
    );

  /**
   * 5. CONDITIONAL RENDERING: Status Loading
   * Menampilkan indikator teks sederhana saat proses API masih berjalan.
   */
  if (loading)
    return <p className="text-center mt-20 text-gray-600 dark:text-gray-300">Loading...</p>;

  /**
   * 6. CONDITIONAL RENDERING: Data Kosong
   * Menampilkan pesan jika user sudah login tetapi belum pernah melakukan reservasi apapun.
   */
  if (!Array.isArray(reservations) || reservations.length === 0)
    return (
      <p className="text-center mt-20 text-gray-600 dark:text-gray-300">
        You have no active reservations.
      </p>
    );

  return (
    /**
     * 7. MAIN RENDER: Container utama daftar reservasi.
     * Menggunakan layout space-y-6 untuk memberikan jarak antar kartu reservasi.
     */
    <div className="max-w-6xl mx-auto mt-24 px-6 space-y-6">
      {/* Melakukan pemetaan (mapping) terhadap data reservasi.
          Setiap data akan dirender menggunakan komponen anak 'ReservationCard'.
      */}
      {reservations.map((r) => (
        <ReservationCard key={r.id_reservasi} data={r} />
      ))}
    </div>
  );
}