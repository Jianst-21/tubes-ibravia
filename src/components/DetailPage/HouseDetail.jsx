import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PopupReservation from "../../components/PopUp/PopupReservation";

/**
 * Komponen HouseDetail
 * Menampilkan detail lengkap sebuah rumah termasuk foto (carousel), spesifikasi, dan harga.
 * Juga menangani logika reservasi (booking) dan fitur zoom gambar.
 */
export default function HouseDetail({ house, setSelectedHouse }) {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  const [currentIndex, setCurrentIndex] = useState(0); // Index untuk carousel utama
  const [bookingStatus, setBookingStatus] = useState(house?.status || "available"); // Status ketersediaan rumah
  const [showReservationPopup, setShowReservationPopup] = useState(false); // Kontrol popup sukses reservasi
  const [showZoom, setShowZoom] = useState(false); // Kontrol modal zoom gambar
  const [zoomIndex, setZoomIndex] = useState(0); // Index gambar yang sedang di-zoom

  // Daftar gambar statis (mockup) untuk detail rumah
  const images = [
    "/images/property/R.png",
    "/images/property/bathroom 3.png",
    "/images/property/bedroom 1.png",
    "/images/property/bedroom 2.png",
    "/images/property/garage 2.png",
    "/images/property/kitchen 2.png",
    "/images/property/living room 3.png",
  ];

  // 2. EFFECT: Menentukan gambar default (R.png) saat komponen pertama kali dimuat atau rumah berganti
  useEffect(() => {
    const defaultIndex = images.findIndex((img) => img.includes("R.png"));
    if (defaultIndex !== -1) setCurrentIndex(defaultIndex);
  }, [house]);

  // Mengambil data user dari localStorage untuk validasi login
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 3. EFFECT: Sinkronisasi status booking jika data 'house' dari props berubah
  useEffect(() => {
    setBookingStatus(house?.status || "available");
  }, [house]);

  // 4. CAROUSEL HANDLERS: Fungsi navigasi gambar (Slide Kiri & Kanan)
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  /**
   * 5. LOGIKA RESERVASI (handleBookNow)
   * Mengirim permintaan reservasi ke backend.
   * Melakukan validasi login dan kelengkapan data sebelum memproses.
   */
  const handleBookNow = async () => {
    if (!user) {
      alert("You need to log in before making a reservation.");
      navigate("/Login");
      return;
    }

    if (!house.id_house || !house.id_pt) {
      alert("This house cannot be reserved because its data is incomplete.");
      return;
    }

    try {
      await api.post("/reservations", {
        id_user: user.id_user,
        id_pt: house.id_pt,
        id_house: house.id_house,
        reservation_status: "pending",
      });
      setShowReservationPopup(true); // Tampilkan popup sukses
      setBookingStatus("reserved"); // Update UI local
      if (setSelectedHouse) {
        // Update data pada komponen parent agar sinkron
        setSelectedHouse((prev) => ({ ...prev, status: "reserved" }));
      }
    } catch (err) {
      console.error("Reservation error:", err);
      alert(err.response?.data?.error || "Failed to make a reservation.");
    }
  };

  /**
   * 6. UI HELPER: getButtonProps
   * Menentukan label teks dan status 'disabled' pada tombol berdasarkan status rumah.
   */
  const getButtonProps = () => {
    switch (bookingStatus) {
      case "sold":
        return { text: "Sold Out", disabled: true };
      case "reserved":
        return { text: "Reserved", disabled: true };
      default:
        return { text: "Book Now", disabled: false };
    }
  };
  const { text: buttonText, disabled: buttonDisabled } = getButtonProps();

  /**
   * 7. ZOOM HANDLERS
   * Fungsi untuk mengelola tampilan gambar dalam ukuran penuh (fullscreen modal).
   */
  const handleImageClick = (index) => {
    setZoomIndex(index);
    setShowZoom(true);
  };

  const handleZoomPrev = () => setZoomIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleZoomNext = () => setZoomIndex((prev) => (prev + 1) % images.length);

  // Jika tidak ada rumah yang dipilih, tampilkan pesan kosong
  if (!house) {
    return <p className="text-center mt-6 text-muted-foreground">Select a house to view details</p>;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-6 md:px-16 py-12 transition-colors duration-500">
      
      {/* ================= SECTION: CAROUSEL 3D ================= 
          Menampilkan gambar dengan efek transisi kiri-tengah-kanan menggunakan Framer Motion */}
      <div className="relative flex justify-center items-center mb-14 h-[420px] overflow-hidden">
        {/* Navigasi Kiri */}
        <button
          onClick={handlePrev}
          className="cursor-pointer absolute left-4 md:left-10 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-background/70 hover:bg-background/90 hover:scale-110 transition-all duration-300 shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* List Gambar Carousel */}
        <div className="flex justify-center items-center w-full h-full relative">
          {images.map((img, index) => {
            const isActive = index === currentIndex;
            const isLeft = index === (currentIndex - 1 + images.length) % images.length;
            const isRight = index === (currentIndex + 1) % images.length;

            return (
              <motion.img
                key={index}
                src={img}
                alt={`House ${index}`}
                onClick={() => handleImageClick(index)}
                className={`absolute rounded-2xl object-cover shadow-2xl transition-all duration-700 ease-in-out cursor-pointer
                ${
                  isActive
                    ? "w-[600px] h-[400px] z-50 opacity-100 scale-100 pointer-events-auto"
                    : isLeft
                      ? "w-[460px] h-[320px] -translate-x-64 scale-90 opacity-70 z-10 pointer-events-none"
                      : isRight
                        ? "w-[460px] h-[320px] translate-x-64 scale-90 opacity-70 z-10 pointer-events-none"
                        : "hidden pointer-events-none"
                }`}
              />
            );
          })}
        </div>

        {/* Navigasi Kanan */}
        <button
          onClick={handleNext}
          className="cursor-pointer absolute right-4 md:right-10 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-background/70 hover:bg-background/90 hover:scale-110 transition-all duration-300 shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ================= SECTION: HOUSE INFO ================= 
          Menampilkan informasi teks seperti Blok, Nama Perumahan, dan Spesifikasi */}
      <div className="max-w-6xl mx-auto">
        <div className="text-left">
          <p className="text-primary font-semibold mb-1">
            Block {house.block?.block_name} {house.number_block}
          </p>

          <h2 className="text-3xl font-bold mb-6">
            {house.block?.residence?.residence_name || "Unknown Residence"}
          </h2>

          <div className="space-y-2 text-base text-foreground/90">
            <p>
              <span className="font-medium">House Description:</span>{" "}
              {`${house.block?.bedroom || 0} Bedrooms, ${house.block?.bathroom || 0} 
              Bathrooms, ${house.block?.living_room || 0} Living Room, ${house.block?.family_room || 0} 
              Family Room, ${house.block?.kitchen || 0} Kitchen`}
            </p>
            <p><span className="font-medium">Land Area (m²):</span> {house.land_area}</p>
            <p><span className="font-medium">Building Area (m²):</span> {house.house_area}</p>
            <p><span className="font-medium">Address:</span> {house.block?.residence?.location || "Unknown location"}</p>
          </div>
        </div>

        {/* ================= SECTION: PRICE & BUTTON ================= 
            Menampilkan rincian harga dan tombol aksi reservasi */}
        <div className="flex justify-end mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10 w-full sm:w-auto text-center sm:text-left">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-1">Full Payment</p>
              <div className="border border-border rounded-[4px] px-5 py-3 text-center min-w-[160px]">
                <p className="font-semibold text-foreground">
                  IDR {Number(house.full_price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-1">Down Payment</p>
              <div className="border border-border rounded-[4px] px-5 py-3 text-center min-w-[160px]">
                <p className="font-semibold text-foreground">
                  IDR {Number(house.down_payment).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Tombol Reservasi dengan Animasi status perubahan warna */}
            <AnimatePresence mode="wait">
              <motion.button
                key={bookingStatus}
                onClick={handleBookNow}
                disabled={buttonDisabled}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={!buttonDisabled ? { scale: 1.05 } : {}}
                whileTap={!buttonDisabled ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2 }}
                className={`h-[46px] px-8 rounded-[8px] font-semibold text-white shadow-md transition-all duration-500 
                ${
                  bookingStatus === "sold"
                    ? "bg-gray-700 cursor-not-allowed opacity-70"
                    : bookingStatus === "reserved"
                      ? "bg-yellow-500 cursor-not-allowed opacity-90"
                      : "bg-primary hover:bg-primary/90 active:bg-primary/80 cursor-pointer"
                }`}
              >
                {buttonText}
              </motion.button>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ================= SECTION: ZOOM POPUP ================= 
          Modal fullscreen untuk melihat gambar lebih detail */}
      <AnimatePresence mode="wait">
        {showZoom && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative flex items-center justify-center"
            >
              <motion.img
                key={zoomIndex}
                src={images[zoomIndex]}
                alt="Zoomed"
                className="rounded-xl shadow-2xl cursor-zoom-out object-cover bg-black"
                style={{ width: "900px", height: "500px", maxWidth: "90vw", maxHeight: "75vh" }}
                initial={{ x: 100, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />

              {/* Navigasi di dalam Zoom */}
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomPrev(); }}
                className="cursor-pointer absolute left-[-80px] p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
              >
                <ChevronLeft size={40} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleZoomNext(); }}
                className="cursor-pointer absolute right-[-80px] p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
              >
                <ChevronRight size={40} />
              </button>

              {/* Tombol Tutup Zoom */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowZoom(false); }}
                className="cursor-pointer absolute top-[-60px] right-[-60px] p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
              >
                <X size={30} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Komponen Popup saat reservasi berhasil dikirim */}
      <PopupReservation
        show={showReservationPopup}
        onClose={() => setShowReservationPopup(false)}
      />
    </div>
  );
}