import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { VillaButton } from "../GlobalPage/VillaButton";
import { BlockPreview } from "../GlobalPage/BlockPreview";
import { ChevronLeft, ChevronRight } from "lucide-react";


const villas = [
  { id: "N001", name: "Villa Ijen Nebraska" },
  { id: "R001", name: "Villa Ijen Raya" },
  { id: "D001", name: "Villa Ijen Delima" },
  { id: "G001", name: "Villa Ijen Gold 3" },
];

export const Block = () => {
  const navigate = useNavigate();
  const [selectedVilla, setSelectedVilla] = useState(villas[0].id);
  const [blocks, setBlocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  //  Fetch data
  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/block/${selectedVilla}`
      );

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

  useEffect(() => {
    fetchBlocks();
    setCurrentPage(1);
  }, [selectedVilla]);

  // Pagination logic
  const totalPages = Math.ceil(blocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlocks = blocks.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-10 px-4">
        <h3 className="text-sm font-medium opacity-80">
          Find the home that fits your lifestyle and future
        </h3>
        <h1 className="text-3xl font-bold mt-2 text-primary ">
          House Collections
        </h1>
      </div>

      {/* Tombol Villa (pakai komponen VillaButton) */}
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

      {/* Placeholder Gambar */}
      <div className="w-11/12 sm:w-10/12 h-80 sm:h-[480px] rounded-2xl mb-10  mt-[100px] 
      flex items-center justify-center bg-secondary/30 border border-dynamic">
        <BlockPreview selectedVilla={selectedVilla} />
      </div>


      {/* Grid Block */}
      {loading ? (
        <div className="text-center text-sm opacity-70 mt-6">
          Loading blocks...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-8 w-11/12 sm:w-10/12">
          {currentBlocks.map((block) => {
            const imgPath = `/images/block/${block.block_name}.png`;

            return (
              <div
                key={block.id_block}
                className="cursor-pointer rounded-xl overflow-hidden border border-border hover:scale-[1.03] transition-all duration-300"
                onClick={() =>
                  navigate(`/detail-properties/${block.id_block}`)
                }
              >
                <img
                  src={imgPath}
                  alt={`Block ${block.block_name}`}
                  onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                  className="w-full h-36 sm:h-40 object-cover"
                />
                <div className="p-3 text-center font-semibold">
                  Block {block.block_name}
                </div>
              </div>
            );
          })}

          {!loading && blocks.length === 0 && (
            <div className="col-span-full text-center opacity-60">
              No blocks found for this residence.
            </div>
          )}
        </div>
      )}


      {/* Pagination */}
      <div className="flex items-center gap-3 mt-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border border-border transition-all duration-300 ${currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110"
            }`}
          style={{
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <span className="font-medium text-sm sm:text-base">
          {currentPage}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border border-border transition-all duration-300 ${currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110"
            }`}
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
