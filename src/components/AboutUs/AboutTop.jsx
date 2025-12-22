import backgroundImage from "@/assets/images/colection/property-page.png";

/**
 * Komponen AboutTop
 * Berfungsi sebagai section "Hero" atau bagian paling atas pada halaman About Us.
 * Menggunakan layout flexbox yang responsif (kolom di mobile, baris di desktop).
 */
export const AboutTop = () => {
  return (
    <section
      className="
        relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden
        px-6                 /* Padding Horizontal Mobile */
        md:px-12             /* Tablet */
        lg:px-[80px]         /* Desktop 1024px */
        xl:px-[100px]        /* Desktop 1280px */
        2xl:px-[120px]       /* Layar Ultra Wide 1440px+ */
      "
    >
      {/* 1. BAGIAN BACKGROUND: Menampilkan gambar utama sebagai latar belakang section */}
      <img
        src={backgroundImage}
        alt="Background Bedroom"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* 2. OVERLAY: Lapisan hitam transparan agar teks di atasnya tetap kontras dan mudah dibaca */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 3. MAIN CONTENT WRAPPER: Container utama untuk konten (Gambar & Teks) */}
      <div
        className="
          relative z-10 flex flex-col md:flex-row items-center justify-between
          gap-10 lg:gap-16 xl:gap-20
          w-full
        "
      >
        {/* 4. LEFT IMAGE: Bagian untuk menampilkan foto profil/produk rumah di sisi kiri */}
        <div
          className="
            rounded-3xl overflow-hidden shadow-2xl border border-white/30
            w-[512px] max-w-full aspect-[512/344]
            mt-[40px] mb-[40px]
            md:mt-[50px] md:mb-[50px]
            lg:mt-[60px] lg:mb-[60px]
            xl:mt-[50px] xl:mb-[50px]
            2xl:mt-[70px] 2xl:mb-[70px]
          "
        >
          <img
            src="/images/block/A.png"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 5. RIGHT TEXT: Bagian informasi teks (Judul dan Deskripsi Ibravia) */}
        <div className="text-white max-w-[512px] text-left flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-[48px]">About Us, IBRAVIA</h2>

          <p className="text-base md:text-lg leading-relaxed text-gray-100 text-justify">
            Ibravia is a trusted property developer dedicated to creating modern, comfortable, and
            affordable homes for families. With a commitment to quality and customer satisfaction,
            we strive to guide every client through their journey of finding the perfect home.
          </p>
        </div>
      </div>
    </section>
  );
};