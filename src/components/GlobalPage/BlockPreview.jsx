import React, { useState, useRef, useEffect } from "react";

/**
 * Komponen BlockPreview
 * Berfungsi untuk menampilkan preview denah blok perumahan.
 * Dilengkapi dengan fitur Zoom (menggunakan mouse wheel) dan Pan (klik dan geser).
 */
export const BlockPreview = ({ selectedVilla }) => {
  // 1. STATE MANAGEMENT
  const [zoom, setZoom] = useState(1); // Tingkat perbesaran gambar
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Posisi pergeseran gambar (X dan Y)
  const [dragging, setDragging] = useState(false); // Status apakah user sedang menggeser gambar
  const [start, setStart] = useState({ x: 0, y: 0 }); // Titik awal koordinat saat klik dimulai
  
  const containerRef = useRef(null); // Referensi untuk container pembungkus
  const imgRef = useRef(null); // Referensi untuk elemen gambar

  // 2. SCROLL PREVENTION: Mencegah halaman utama ikut scroll saat mouse berada di area preview
  useEffect(() => {
    const handleWheelBlock = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheelBlock, { passive: false });
    return () => window.removeEventListener("wheel", handleWheelBlock);
  }, []);

  // 3. ZOOM HANDLER: Mengatur perbesaran gambar berdasarkan putaran wheel mouse
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2; // Zoom in jika scroll ke atas, zoom out jika ke bawah
    setZoom((z) => Math.min(Math.max(0.5, z + delta), 5)); // Batas zoom minimal 0.5x dan maksimal 5x
  };

  // 4. PANNING HANDLERS (Mouse Events): Logika untuk menggeser gambar
  const handleMouseDown = (e) => {
    setDragging(true);
    // Menyimpan posisi mouse dikurangi offset saat ini agar pergerakan sinkron
    setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const rect = container.getBoundingClientRect();
    const imgWidth = img.naturalWidth * zoom;
    const imgHeight = img.naturalHeight * zoom;

    // Menghitung batas maksimal pergeseran agar gambar tidak hilang dari layar
    const maxX = Math.max(0, (imgWidth - rect.width) / 2);
    const maxY = Math.max(0, (imgHeight - rect.height) / 2);

    let newX = e.clientX - start.x;
    let newY = e.clientY - start.y;

    // Membatasi pergerakan X dan Y jika ukuran gambar lebih besar dari container
    if (imgWidth > rect.width) {
      newX = Math.max(-maxX, Math.min(maxX, newX));
    }
    if (imgHeight > rect.height) {
      newY = Math.max(-maxY, Math.min(maxY, newY));
    }

    setOffset({ x: newX, y: newY });
  };

  // 5. AUTO-FIT LOGIC: Menyesuaikan ukuran gambar pertama kali agar pas di dalam container
  useEffect(() => {
    const fitImage = () => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;

      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Mencari skala terkecil agar seluruh gambar masuk ke dalam kotak
      const scale = Math.min(cw / iw, ch / ih); 
      setZoom(scale * 2.8); // Dikalikan 2.8 agar gambar terlihat cukup besar secara default
      setOffset({ x: 0, y: 0 });
    };

    const img = imgRef.current;
    if (img && img.complete) fitImage();
    else img?.addEventListener("load", fitImage);

    return () => img?.removeEventListener("load", fitImage);
  }, [selectedVilla]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden rounded-2xl flex items-center justify-center 
      bg-secondary/30 select-none cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        overscrollBehavior: "contain",
      }}
    >
      {/* 6. RENDER GAMBAR: Menampilkan gambar villa berdasarkan prop yang dipilih */}
      {selectedVilla ? (
        <img
          ref={imgRef}
          src={`/images/residence/${selectedVilla}.png`}
          alt={selectedVilla}
          draggable={false} // Mencegah fitur drag default browser
          style={{
            // Menggabungkan posisi offset (pan) dan skala (zoom) dalam satu transform
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            // Transition dimatikan saat dragging agar pergerakan terasa instan dan responsif
            transition: dragging ? "none" : "transform 0.25s ease-out",
            userSelect: "none",
            pointerEvents: "none",
            maxWidth: "none",
            maxHeight: "none",
          }}
          // Fallback jika gambar gagal dimuat
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=No+Image";
          }}
        />
      ) : (
        // Placeholder jika belum ada villa yang dipilih
        <span
          role="button"
          tabIndex={0}
          onClick={() => alert("Clicked!")}
          onKeyDown={(e) => e.key === "Enter" && alert("Clicked!")}
          className="opacity-50 text-sm cursor-pointer"
        >
          [ Image Preview ]
        </span>
      )}
    </div>
  );
};