import React, { useState, useEffect } from "react";
import backgroundImage from "../../../src/assets/images/colection/property-page.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HouseSelector({ houses = [], selectedHouseId, onSelect }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [housesPerPage, setHousesPerPage] = useState(20);

  //  Ganti jumlah per halaman sesuai lebar layar
  useEffect(() => {
    const updatePerPage = () => {
      if (window.innerWidth <= 640) setHousesPerPage(4);
      else setHousesPerPage(20);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  //  Sorting
  const sortedHouses = [...houses].sort((a, b) => {
    const valA = String(a.number_block || "").padStart(3, "0");
    const valB = String(b.number_block || "").padStart(3, "0");
    return valA.localeCompare(valB, undefined, { numeric: true });
  });

  const totalPages = Math.max(1, Math.ceil(sortedHouses.length / housesPerPage));
  const startIndex = (currentPage - 1) * housesPerPage;
  const currentHouses = sortedHouses.slice(startIndex, startIndex + housesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [houses]);

  return (
    <section
      className="relative w-screen h-[80vh] left-1/2 right-1/2 -translate-x-1/2 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize:
          window.innerWidth <= 1024 ? "120% auto" : "110% auto",
        backgroundPosition: "center center",
      }}

    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-3 sm:px-6 text-center text-white">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-12 drop-shadow-lg">
          Choose Your House!
        </h2>

        {/* Grid rumah */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-6 justify-items-center max-w-7xl w-full"
        >
          {currentHouses.length > 0 ? (
            currentHouses.map((house) => {
              const isSelected = selectedHouseId === house.id_house;
              const isSold = house.status === "sold";

              return (
                <button
                  key={house.id_house}
                  onClick={() => !isSold && onSelect(house)}
                  disabled={isSold}
                  className={`w-[80px] sm:w-full aspect-[2/3] flex items-center justify-center font-semibold text-sm sm:text-lg shadow-md transition-all duration-300 rounded-[8px]
          ${isSold
                      ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                      : isSelected
                        ? "bg-blue-700 text-white scale-105 shadow-lg cursor-pointer"
                        : "bg-white text-black hover:scale-105 hover:bg-gray-100 cursor-pointer active:scale-95"
                    }`}
                >
                  {house.number_block || `#${house.id_house}`}
                </button>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-300 opacity-70">
              No houses found for this block.
            </div>
          )}

        </div>

        {/* Pagination */}
        <div className="flex items-center gap-3 mt-8 sm:mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border transition-all duration-300 ${currentPage === 1
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

          <span
            className="font-semibold text-base sm:text-lg"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border transition-all duration-300 ${currentPage === totalPages
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
