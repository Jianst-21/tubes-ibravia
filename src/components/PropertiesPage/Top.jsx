import backgroundImage from "../../../src/assets/images/colection/property-page.png";

/**
 * Komponen Top
 * Berfungsi sebagai bagian "Hero" atau banner utama pada halaman daftar properti.
 * Menampilkan gambar latar belakang besar dengan kotak teks transparan di tengahnya.
 */
export const Top = () => {
  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] lg:h-[85vh] 
    flex items-center justify-center overflow-hidden"
    >
      {/* 1. BACKGROUND IMAGE: Mengatur gambar latar belakang penuh dengan object-cover agar tidak distorsi */}
      <img
        src={backgroundImage}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 2. SOFT OVERLAY: Memberikan lapisan hitam sangat tipis agar background tidak terlalu terang */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 3. CENTER CONTENT BOX: Kotak putih transparan (Glassmorphism) sebagai wadah teks utama */}
      <div
        className="relative z-10 flex flex-col items-center justify-center 
      bg-white/50 px-20 py-16 bordershadow-md max-w-4xl text-center rounded-[8px]"
      >
        {/* JUDUL UTAMA: Menggunakan ukuran teks besar yang responsif */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-18">
          Discover Your Perfect Property
        </h1>
        
        {/* SUB-TEKS: Penjelasan singkat mengenai tujuan halaman ini */}
        <p className="text-lg md:text-xl text-gray-900 leading-relaxed max-w-xl">
          Start your journey by exploring our curated homes and residences.
        </p>
      </div>
    </section>
  );
};