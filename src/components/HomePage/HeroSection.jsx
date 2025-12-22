import backgroundImage from "../../../src/assets/images/colection/homepage-atas.png";

/**
 * Komponen HeroSection
 * Menampilkan bagian utama (banner) di halaman beranda.
 * Menggunakan latar belakang gambar penuh dengan overlay teks di sisi kiri.
 */
export const HeroSection = () => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] flex 
      items-center overflow-hidden -mb-px bg-[hsl(var(--card))]"
    >
      {/* 1. GRADIENT OVERLAY: Memberikan lapisan gradasi hitam agar teks putih lebih mudah dibaca (kontras) */}
      <div
        className="absolute left-0 top-0 bg-gradient-to-r from-black/70 
        via-black/40 to-transparent z-10 w-full h-full"
      />

      {/* 2. BACKGROUND IMAGE: Gambar latar utama yang diatur agar memenuhi area (object-cover) */}
      <img
        src={backgroundImage}
        alt="Hero Background"
        className="absolute inset-0 bottom-[-1px] w-full h-full object-cover will-change-transform"
      />

      {/* 3. CONTENT WRAPPER: Penempatan konten agar sejajar dengan padding Navbar secara responsif */}
      <div className="relative z-10 w-full">
        <div className="w-full px-4 md:px-6 lg:px-[80px] xl:px-[120px] 2xl:px-[160px] text-left text-white">
          
          {/* Judul Utama dengan penekanan brand pada kata 'Ibravia' */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Welcome to Your Future Home,
            <br />
            <span className="text-primary">Ibravia</span>
          </h1>

          {/* Deskripsi singkat mengenai nilai jual properti */}
          <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed max-w-md">
            Discover a selection of modern homes designed for comfort, quality, and your future
            lifestyle.
          </p>

          {/* Tombol Call to Action (CTA) untuk mengarahkan pengguna ke halaman Properti */}
          <button
            className="cursor-pointer bg-primary text-primary-foreground font-medium 
            text-base px-6 py-3 rounded-[8px] transition-all duration-300 hover:scale-105 
            hover:shadow-md dark:hover:shadow-glow"
            onClick={() => (window.location.href = "/Properties")}
          >
            Find Your Home
          </button>
        </div>
      </div>
    </section>
  );
};