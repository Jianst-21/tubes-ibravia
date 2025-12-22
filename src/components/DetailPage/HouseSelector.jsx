import React, { useState, useEffect } from "react";
import backgroundImage from "../../../src/assets/images/colection/property-page.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Komponen HouseSelector
 * Berfungsi untuk menampilkan grid daftar nomor rumah yang tersedia dalam satu blok.
 * Memiliki fitur responsif, sorting nomor, dan navigasi halaman (pagination).
 */
export default function HouseSelector({ houses = [], selectedHouseId, onSelect }) {
  // 1. STATE MANAGEMENT
  const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman aktif saat ini
  const [housesPerPage, setHousesPerPage] = useState(18); // Menentukan jumlah kotak rumah per halaman

  // 2. RESPONSIVE LOGIC: Mengatur jumlah tampilan rumah berdasarkan lebar layar (Viewport)
  useEffect(() => {
    const updatePerPage = () => {
      if (window.innerWidth <= 640)
        setHousesPerPage(4); // Tampilan Mobile: 4 rumah
      else if (window.innerWidth < 1280)
        setHousesPerPage(18); // Tampilan Laptop: 18 rumah
      else setHousesPerPage(20); // Tampilan Layar Besar (>1280px): 20 rumah
    };

    updatePerPage();
    // Menambahkan listener untuk memantau perubahan ukuran layar
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  // 3. SORTING LOGIC: Mengurutkan rumah berdasarkan nomor blok secara alfabetis/numerik (Natural Sort)
  const sortedHouses = [...houses].sort((a, b) => {
    const valA = String(a.number_block || "").padStart(3, "0");
    const valB = String(b.number_block || "").padStart(3, "0");
    return valA.localeCompare(valB, undefined, { numeric: true });
  });

  // 4. PAGINATION CALCULATIONS: Menghitung jumlah halaman dan memotong array data
  const totalPages = Math.max(1, Math.ceil(sortedHouses.length / housesPerPage));
  const startIndex = (currentPage - 1) * housesPerPage;
  const currentHouses = sortedHouses.slice(startIndex, startIndex + housesPerPage);

  // 5. EFFECT: Reset halaman ke-1 jika data houses berubah (misal ganti blok)
  useEffect(() => {
    setCurrentPage(1);
  }, [houses]);

  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* OVERLAY: Lapisan gelap transparan untuk meningkatkan keterbacaan konten */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* MAIN CONTAINER */}
      <div
        className="relative z-10 flex flex-col justify-start items-center px-4 sm:px-10 md:px-[120px] text-center text-white"
        style={{
          paddingTop: "7rem", // Jarak aman dari Navbar
          paddingBottom: "4rem", 
        }}
      >
        {/* JUDUL SECTION */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-12 drop-shadow-lg">
          Choose Your House!
        </h2>

        {/* HOUSE GRID: Menampilkan kotak-kotak rumah dalam grid yang fleksibel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-10 gap-3 sm:gap-6 md:gap-4 justify-items-center max-w-7xl w-full">
          {currentHouses.length > 0 ? (
            currentHouses.map((house) => {
              // Mengecek status apakah rumah ini sedang dipilih atau sudah terjual
              const isSelected = selectedHouseId === house.id_house;
              const isSold = house.status === "sold";

              return (
                <button
                  key={house.id_house}
                  // Jalankan onSelect hanya jika rumah belum terjual (isSold: false)
                  onClick={() => !isSold && onSelect(house)}
                  disabled={isSold}
                  className={`w-[80px] sm:w-full aspect-[2/3] flex items-center justify-center 
                  font-semibold text-sm sm:text-lg shadow-md transition-all duration-300 rounded-[8px]
                  ${
                    isSold
                      ? "bg-gray-700 text-gray-300 cursor-not-allowed" // Style jika Sold Out
                      : isSelected
                        ? "bg-blue-700 text-white scale-105 shadow-lg cursor-pointer" // Style jika Dipilih
                        : "bg-white text-black hover:scale-105 hover:bg-gray-100 cursor-pointer active:scale-95" // Style Default
                  }`}
                >
                  {/* Menampilkan nomor blok, jika tidak ada tampilkan ID rumah */}
                  {house.number_block || `#${house.id_house}`}
                </button>
              );
            })
          ) : (
            // Pesan jika tidak ada rumah di blok yang dipilih
            <div className="col-span-full text-center text-gray-300 opacity-70">
              No houses found for this block.
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS: Tombol navigasi halaman */}
        <div className="flex items-center gap-3 mt-8 sm:mt-10 mb-6 sm:mb-10 md:mb-14">
          {/* Tombol Halaman Sebelumnya */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border transition-all duration-300 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 hover:shadow-md"
            }`}
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Indikator Angka Halaman Aktif */}
          <span
            className="font-semibold text-base sm:text-lg"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {currentPage}
          </span>

          {/* Tombol Halaman Selanjutnya */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border transition-all duration-300 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110 hover:shadow-md"
            }`}
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}