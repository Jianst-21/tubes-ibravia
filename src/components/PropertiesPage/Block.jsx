import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { VillaButton } from "../GlobalPage/VillaButton";
import { BlockPreview } from "../GlobalPage/BlockPreview";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Konfigurasi data statis Villa/Perumahan.
 * Digunakan sebagai filter utama untuk memuat data blok yang berbeda.
 */
const villas = [
  { id: "N001", name: "Villa Ijen Nebraska" },
  { id: "R001", name: "Villa Ijen Raya" },
  { id: "D001", name: "Villa Ijen Delima" },
  { id: "G001", name: "Villa Ijen Gold 3" },
];

/**
 * Komponen Block
 * Berfungsi untuk menampilkan daftar blok perumahan berdasarkan villa yang dipilih.
 * Memiliki fitur pengambilan data dari API, pengurutan (sorting), dan navigasi halaman (pagination).
 */
export const Block = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  const [selectedVilla, setSelectedVilla] = useState(villas[0].id); // Melacak villa mana yang aktif dipilih
  const [blocks, setBlocks] = useState([]); // Menyimpan array data blok dari API
  const [currentPage, setCurrentPage] = useState(1); // Melacak halaman aktif pada grid blok
  const [loading, setLoading] = useState(false); // Status loading saat proses fetch data
  const itemsPerPage = 10; // Jumlah kartu blok yang ditampilkan per halaman

  /**
   * 2. FUNGSI FETCH DATA: fetchBlocks
   * Mengambil data blok dari backend berdasarkan ID villa yang dipilih.
   * Melakukan sorting secara manual agar urutan blok sesuai dengan urutan angka (Natural Sort).
   */
  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/block/${selectedVilla}`, {
        withCredentials: true,
      });

      // Logika Sorting: Mengambil angka dari nama blok untuk dibandingkan
      const sortedBlocks = (res.data || []).sort((a, b) => {
        const numA = parseInt(a.block_name.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.block_name.replace(/\D/g, "")) || 0;
        return numA - numB;
      });

      setBlocks(sortedBlocks);
    } catch (err) {
      console.error("Error fetching blocks:", err.response?.data || err);
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 3. EFFECT: Menjalankan fetch data setiap kali user mengganti pilihan villa.
   * Juga mereset halaman pagination kembali ke angka 1.
   */
  useEffect(() => {
    fetchBlocks();
    setCurrentPage(1);
  }, [selectedVilla]);

  // 4. LOGIKA PAGINATION: Memotong array 'blocks' untuk ditampilkan per halaman
  const totalPages = Math.ceil(blocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlocks = blocks.slice(startIndex, endIndex);

  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 bg-background 
    text-foreground transition-colors duration-300"
    >
      {/* 5. HEADER: Judul bagian koleksi rumah */}
      <div className="text-center mb-10 px-4">
        <h3 className="text-[16px] font-medium opacity-80 uppercase tracking-wider text-primary font-semibold">
          Find the home that fits your lifestyle and future
        </h3>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 ">House Collections</h1>
      </div>

      {/* 6. VILLA NAVIGATION: Daftar tombol villa besar untuk memfilter data */}
      <div className="flex flex-wrap justify-center gap-8 px-[54px]">
        {villas.map((villa) => (
          <VillaButton
            key={villa.id}
            name={villa.name}
            active={selectedVilla === villa.id}
            onClick={() => setSelectedVilla(villa.id)}
          />
        ))}
      </div>

      {/* 7. BLOCK PREVIEW: Area visual besar untuk menampilkan denah/gambar villa yang dipilih */}
      <div
        className="w-11/12 sm:w-10/12 h-80 sm:h-[480px] rounded-2xl mb-10  mt-[100px] 
      flex items-center justify-center bg-secondary/30 border border-dynamic"
      >
        <BlockPreview selectedVilla={selectedVilla} />
      </div>

      {/* 8. GRID BLOCKS: Menampilkan daftar blok dalam bentuk kartu kecil */}
      {loading ? (
        <div className="text-center text-sm opacity-70 mt-6">Loading blocks...</div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
        lg:grid-cols-5 gap-5 sm:gap-8 w-11/12 sm:w-10/12"
        >
          {currentBlocks.map((block) => {
            // Path gambar dinamis berdasarkan nama blok
            const imgPath = `/images/block/${block.block_name}.png`;

            return (
              <div
                key={block.id_block}
                className="cursor-pointer rounded-xl overflow-hidden border 
                border-border hover:scale-[1.03] transition-all duration-300"
                onClick={() => navigate(`/detail-properties/${block.id_block}`)}
              >
                <img
                  src={imgPath}
                  alt={`Block ${block.block_name}`}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")
                  }
                  className="w-full h-36 sm:h-40 object-cover"
                />
                <div className="p-3 text-center font-semibold">Block {block.block_name}</div>
              </div>
            );
          })}

          {/* Pesan jika data blok kosong */}
          {!loading && blocks.length === 0 && (
            <div className="col-span-full text-center opacity-60">
              No blocks found for this residence.
            </div>
          )}
        </div>
      )}

      {/* 9. PAGINATION CONTROLS: Navigasi tombol halaman (Kiri/Kanan) */}
      <div className="flex items-center gap-3 mt-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`cursor-pointer flex items-center justify-center w-10 h-10 
            rounded-full border border-border transition-all duration-300 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
            }`}
          style={{
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <span className="font-medium text-sm sm:text-base">{currentPage}</span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`cursor-pointer flex items-center justify-center w-10 h-10 
            rounded-full border border-border transition-all duration-300 
            ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          style={{
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};