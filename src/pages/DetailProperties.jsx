import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/GlobalPage/Navbar";
import HouseSelector from "../components/DetailPage/HouseSelector";
import HouseDetail from "../components/DetailPage/HouseDetail";
import Footer from "../components/GlobalPage/Footer";
export const DetailProperties = () => {
  const { id_block } = useParams();
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      setError("");
      try {
        if (!id_block) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/houses/block/${id_block}`,
          { withCredentials: true }
        );

        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

        if (data.length === 0) {
          setError("No houses found for this block");
        } else {
          setHouses(data);
          setSelectedHouse(data[0]); // rumah pertama sebagai default
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Konten utama → ini yang harus flex-grow */}
      <div className="flex-grow">
        {error && <p className="text-center mt-6 text-red-500">{error}</p>}

        {!loading && !error && houses.length > 0 && (
          <>
            <HouseSelector
              houses={houses}
              selectedHouseId={selectedHouse?.id_house}
              onSelect={(house) => setSelectedHouse(house)}
            />
            <HouseDetail house={selectedHouse} />
          </>
        )}
      </div>

      {/* Footer selalu di bawah */}
      <Footer />
    </div>
  );
};
