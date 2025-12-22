import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/GlobalPage/Navbar";
import HouseSelector from "../components/DetailPage/HouseSelector";
import HouseDetail from "../components/DetailPage/HouseDetail";
import Footer from "../components/GlobalPage/Footer";

/**
 * Komponen DetailProperties
 * Halaman utama untuk melihat daftar rumah di dalam blok tertentu.
 * Mengelola state koordinasi antara pemilihan nomor rumah dan tampilan detail spesifiknya.
 */
export const DetailProperties = () => {
  // 1. HOOKS: Mengambil id_block dari parameter URL (misal: /detail-properties/15)
  const { id_block } = useParams();

  // 2. STATE MANAGEMENT
  const [houses, setHouses] = useState([]);         // Menyimpan daftar seluruh rumah dalam satu blok
  const [selectedHouse, setSelectedHouse] = useState(null); // Menyimpan satu data rumah yang sedang dipilih user
  const [loading, setLoading] = useState(true);      // Melacak status loading saat fetch data dari API
  const [error, setError] = useState("");            // Menyimpan pesan error jika terjadi kegagalan data

  /**
   * 3. EFFECT: Menjalankan pengambilan data setiap kali id_block pada URL berubah.
   */
  useEffect(() => {
    /**
     * 4. FUNGSI ASYNC: fetchHouses
     * Mengambil data rumah yang terdaftar di blok tersebut melalui backend.
     */
    const fetchHouses = async () => {
      setLoading(true);
      setError("");
      try {
        if (!id_block) return;

        // Request ke API berdasarkan ID blok
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/houses/block/${id_block}`,
          { withCredentials: true }
        );

        // Memastikan format data yang diterima adalah array
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

        if (data.length === 0) {
          setError("No houses found for this block");
        } else {
          setHouses(data);
          // 5. DEFAULT SELECTION: Secara otomatis memilih rumah pertama dalam list saat halaman dibuka
          setSelectedHouse(data[0]); 
        }
      } catch (err) {
        console.error("Gagal mengambil houses:", err);
        setError("Gagal mengambil data houses");
        setHouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [id_block]);

  return (
    /**
     * 6. LAYOUT STRUCTURE:
     * Menggunakan flex-col dan min-h-screen agar Footer selalu berada di bagian bawah halaman
     * meskipun konten tengah sedang sedikit atau kosong.
     */
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* 7. MAIN CONTENT AREA: Tempat HouseSelector dan HouseDetail ditampilkan */}
      <div className="flex-grow">
        {/* Menampilkan pesan error jika data tidak ditemukan atau API gagal */}
        {error && <p className="text-center mt-6 text-red-500">{error}</p>}

        {/* Hanya merender komponen jika data sudah siap (tidak loading & tidak error) */}
        {!loading && !error && houses.length > 0 && (
          <>
            {/* 8. HOUSE SELECTOR: Komponen untuk memilih nomor rumah (grid kotak) */}
            <HouseSelector
              houses={houses}
              selectedHouseId={selectedHouse?.id_house}
              // Mengubah selectedHouse saat user mengklik salah satu kotak rumah
              onSelect={(house) => setSelectedHouse(house)}
            />
            
            {/* 9. HOUSE DETAIL: Menampilkan spesifikasi dan tombol booking untuk rumah yang dipilih */}
            <HouseDetail house={selectedHouse} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};