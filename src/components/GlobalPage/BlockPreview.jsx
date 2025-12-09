import React, { useState, useRef, useEffect } from "react";

export const BlockPreview = ({ selectedVilla }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  //  Mencegah scroll halaman
  useEffect(() => {
    const handleWheelBlock = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheelBlock, { passive: false });
    return () => window.removeEventListener("wheel", handleWheelBlock);
  }, []);

  //  Zoom pakai scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom((z) => Math.min(Math.max(0.5, z + delta), 5)); // min 0.5 biar bisa zoom out dikit
  };

  const handleMouseDown = (e) => {
    setDragging(true);
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

    const maxX = Math.max(0, (imgWidth - rect.width) / 2);
    const maxY = Math.max(0, (imgHeight - rect.height) / 2);

    let newX = e.clientX - start.x;
    let newY = e.clientY - start.y;

    // gambar bebas (tidak dikunci)
    if (imgWidth > rect.width) {
      newX = Math.max(-maxX, Math.min(maxX, newX));
    }
    if (imgHeight > rect.height) {
      newY = Math.max(-maxY, Math.min(maxY, newY));
    }

    setOffset({ x: newX, y: newY });
  };

  //  Auto-fit (gambar masuk penuh tanpa potong)
  useEffect(() => {
    const fitImage = () => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;

      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.min(cw / iw, ch / ih); // skala untuk fit
      setZoom(scale * 2.8);
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
      {selectedVilla ? (
        <img
          ref={imgRef}
          src={`/images/residence/${selectedVilla}.png`}
          alt={selectedVilla}
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.25s ease-out",
            userSelect: "none",
            pointerEvents: "none",
            maxWidth: "none",
            maxHeight: "none",
          }}
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=No+Image";
          }}
        />
      ) : (
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
