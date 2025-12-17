import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import apiAdmin from "../api/apiadmin";
import { ChevronDown, Check, Loader2 } from "lucide-react"; // Tambah import Check & Loader2

/* ===============================
   🔽 Komponen Dropdown Kustom (Tidak Berubah) a
=============================== */
const Dropdown = ({ label, options, value, onChange, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="font-medium text-gray-700 mb-2">{label}</label>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between border border-gray-300 rounded-md p-2 w-56 
          bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed opacity-60"
              : "hover:border-blue-500 cursor-pointer"
          }`}
      >
        <span className={`block truncate ${!value ? "text-gray-400" : "text-gray-700"}`}>
          {value
            ? options.find((opt) => opt.value === value)?.label || value
            : placeholder || "Select"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-56 bg-white shadow-lg max-h-60 rounded-md py-1 
        text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in 
        fade-in zoom-in-95 duration-100 top-[calc(100%-0.5rem)]"
        >
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 transition-colors ${
                  option.value === value ? "text-blue-900 bg-blue-50 font-medium" : "text-[#0E1315]"
                }`}
              >
                <span className="block truncate">{option.label}</span>
              </div>
            ))
          ) : (
            <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500 italic">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ===============================
   🏠 Komponen Utama ManageHouse
=============================== */
const ManageHouse = () => {
  const [houses, setHouses] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState("");

  // State baru untuk Pop-up Sukses
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    status: "", // 'available' atau 'sold'
  });

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await apiAdmin.get("/houses");
        setHouses(res.data);
      } catch (err) {
        console.error("Gagal ambil data rumah:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const blockOptions = [
    ...new Set(houses.map((h) => h.block?.block_name || h.block_name).filter(Boolean)),
  ]
    .sort()
    .map((block) => ({ value: block, label: `Block ${block}` }));

  const numberOptions = houses
    .filter((h) => (h.block?.block_name || h.block_name) === selectedBlock)
    .map((h) => h.number_block)
    .filter(Boolean)
    .sort((a, b) => a - b)
    .map((num) => ({
      value: num,
      label: `No. ${String(num).padStart(2, "0")}`,
    }));

  const filteredHouse = houses.find(
    (h) =>
      (h.block?.block_name || h.block_name) === selectedBlock &&
      String(h.number_block) === String(selectedNumber)
  );

  const handleEditClick = () => {
    if (!filteredHouse) return;
    setTargetStatus(filteredHouse.status === "available" ? "sold" : "available");
    setShowModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!filteredHouse || !targetStatus) return;
    setUpdating(true);
    try {
      await apiAdmin.patch(`/houses/${filteredHouse.id_house}/status`, {
        status: targetStatus,
      });

      // Update state lokal dulu
      setHouses((prev) =>
        prev.map((h) =>
          h.id_house === filteredHouse.id_house ? { ...h, status: targetStatus } : h
        )
      );

      // Tutup modal konfirmasi
      setShowModal(false);

      // Tampilkan Modal Sukses
      setSuccessModal({ isOpen: true, status: targetStatus });

      // Tutup otomatis setelah 2 detik
      setTimeout(() => {
        setSuccessModal({ isOpen: false, status: "" });
      }, 2000);
    } catch (err) {
      console.error("Gagal ubah status:", err);
      alert("Failed to update house status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3C78] mr-2" />
        Loading...
      </div>
    );

  let houseDescription = "-";
  let fullAddress = "-";

  if (filteredHouse) {
    const descParts = [];
    if (filteredHouse?.block?.bedroom) descParts.push(`${filteredHouse.block.bedroom} Bedrooms`);
    if (filteredHouse?.block?.bathroom) descParts.push(`${filteredHouse.block.bathroom} Bathrooms`);
    if (filteredHouse?.block?.living_room) descParts.push("Living Room");
    if (filteredHouse?.block?.family_room) descParts.push("Family Room");
    if (filteredHouse?.block?.kitchen) descParts.push("Kitchen");
    houseDescription = descParts.length > 0 ? descParts.join(", ") : "-";

    const residenceName = filteredHouse.residence?.residence_name || "";
    const location = filteredHouse.residence?.location || "";
    const blockName = filteredHouse.block?.block_name || filteredHouse.block_name || "";
    const number = filteredHouse.number_block || "";
    fullAddress = `${residenceName}${
      residenceName ? ", " : ""
    }Block ${blockName} No. ${number}${location ? `, ${location}` : ""}`.trim();
  }

  return (
    <div
      className="flex min-h-screen bg-[#F5FAFF] relative"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Sidebar />

      <main className="flex-1 pl-72 pr-8 py-8 bg-[#F5FAFF]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[48px] font-bold text-[#0E1315] -mt-8 mb-8">Manage House</h1>

          {/* FILTER AREA */}
          <div className="flex gap-6 mb-8 relative z-10">
            <Dropdown
              label="Housing Block"
              options={blockOptions}
              value={selectedBlock}
              onChange={(val) => {
                setSelectedBlock(val);
                setSelectedNumber("");
              }}
              placeholder="Select Block"
            />
            <Dropdown
              label="House Number"
              options={numberOptions}
              value={selectedNumber}
              onChange={setSelectedNumber}
              disabled={!selectedBlock}
              placeholder="Select Number"
            />
          </div>

          {/* CARD DETAIL */}
          {filteredHouse ? (
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full 
            transition-all duration-500 border-b-4 border-b-black hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-[#0B3C78] font-bold text-[24px] uppercase">
                    Block {filteredHouse.block?.block_name} • No. {filteredHouse.number_block}
                  </p>
                  <h2 className="text-[40px] font-bold text-[#0E1315] mt-1">
                    {filteredHouse.residence?.residence_name || "Nama Residence"}
                  </h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full capitalize
                    inline-flex items-center justify-center text-center
                    h-8 min-w-[96px] px-4
                    text-[16px] font-semibold tracking-wider leading-none
                    border border-[1.5px] bg-white border-current ${
                      filteredHouse.status === "sold"
                        ? "border-[#0B3C78] text-[#0B3C78] bg-white"
                        : filteredHouse.status === "available"
                          ? "border-green-200 text-green-700 bg-white"
                          : filteredHouse.status === "reserved"
                            ? "border-[#C5880A] text-[#C5880A] bg-white"
                            : "border-gray-200 text-gray-600 bg-white"
                    }`}
                >
                  {filteredHouse.status}
                </span>

                </div>
              </div>

              <hr className="border-gray-100 mb-5" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="space-y-3">
                  <div>
                    <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                      House Description
                    </span>
                    <p className="text-[16px] text-[#0E1315] leading-relaxed">{houseDescription}</p>
                  </div>
                  <div>
                    <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                      Address
                    </span>
                    <p className="text-[16px] text-[#0E1315] leading-relaxed">{fullAddress}</p>
                  </div>
                </div>
                <div className="space-y-3 md:border-l md:pl-6 border-gray-100">
                  <div className="flex gap-6">
                    <div>
                      <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                        Land Area
                      </span>
                      <p className="text-[16px] text-[#0E1315] leading-relaxed">
                        {filteredHouse.land_area ?? "-"} m²
                      </p>
                    </div>
                    <div>
                      <span className="block text-[16px] font-semibold text-[#0B3C78] uppercase tracking-wider">
                        House Area
                      </span>
                      <p className="text-[16px] text-[#0E1315] leading-relaxed">
                        {filteredHouse.house_area ?? "-"} m²
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-4 border-t border-gray-50">
                <button
                  onClick={handleEditClick}
                  disabled={updating}
                  className="px-6 py-2.5 rounded-lg font-semibold text-white bg-[#0F62FF] 
                  hover:opacity-90 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-70 flex 
                  items-center gap-2 cursor-pointer"
                >
                  Edit Status
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border 
                          border-gray-200 mt-10"
            >
              <p className="text-center text-gray-500 text-lg font-medium">
                {!selectedBlock || !selectedNumber
                  ? "Please select block and house number to view details."
                  : "House data not found for this block/number."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL KONFIRMASI */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 
                      backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 scale-100 
                        animate-in zoom-in-95 duration-200"
          >
            {/* Title */}
            <h3 className="text-xl font-bold text-center text-[#0E1315] mb-2">
              Confirm Status Change
            </h3>

            <div className="w-full h-px bg-gray-200 my-4"></div>

            {/* Message */}
            <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
              {targetStatus === "available"
                ? "Are you sure you want to change the status to available?"
                : "Are you sure you want to change the status to sold?"}
            </p>

            <div className="flex justify-evenly mx-1 mt-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={updating}
                className="w-36 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100
                          hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmUpdate}
                disabled={updating}
                className={`w-36 py-3 rounded-lg font-semibold text-white transition-all
                          shadow-sm active:scale-95 disabled:opacity-70 cursor-pointer flex items-center
                          justify-center gap-2 ${
                            targetStatus === "available"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-[#0B3C78] hover:opacity-90"
                          }`}
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                {updating ? "Updating..." : capitalize(targetStatus)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS POPUP MODAL --- */}
      {successModal.isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40
                 backdrop-blur-sm animate-in fade-in duration-300"
        >
          <div
            className="bg-white rounded-[30px] p-8 md:p-10 shadow-2xl flex flex-col items-center 
                 max-w-sm w-full mx-4 scale-100 animate-in zoom-in-95 duration-300"
          >
            {/* Icon Check Biru Besar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#E6EEFF" }} // biru muda lembut
            >
              <Check
                className="w-12 h-12"
                strokeWidth={3}
                style={{ color: "#0F62FF" }} // warna utama biru
              />
            </div>

            {/* Teks Judul */}
            <h2 className="text-2xl font-extrabold text-[#0E1315] text-center mb-3">
              Status Updated!
            </h2>

            {/* Teks Deskripsi */}
            <p className="text-gray-500 text-center text-base leading-relaxed">
              Status has been changed to{" "}
              <strong className="text-[#0E1315] font-semibold">{successModal.status}</strong>{" "}
              successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper kecil untuk kapitalisasi di tombol
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default ManageHouse;
