import { useRef } from "react";
import { VillaButton } from "../GlobalPage/VillaButton";
import { VillaSlider } from "./VillaSlider";

/**
 * Komponen VillaSection
 * Menampilkan katalog koleksi rumah yang tersedia.
 * Memiliki fitur navigasi "scroll-to-section" menggunakan React Refs.
 */
export const VillaSection = () => {
  // 1. DATA CONSTANT: Menyimpan informasi detail setiap properti (Ijen Nebraska, Raya, Delima, Gold 3).
  // Data ini mencakup ID unik, Nama, dan array berisi slide (Visi-Misi, Overview, dll).
  const villas = [
    {
      id: "N001",
      name: "Villa Ijen Nebraska",
      slides: [
        {
          title: "Villa Ijen Nebraska",
          desc: "Villa Ijen Nebraska is a modern residential project by PT Bumi Moro Agung...",
          img: "/images/block/M.png",
        },
        // ... slide lainnya
      ],
    },
    // ... data villa lainnya
  ];

  // 2. REFS: Digunakan untuk menyimpan referensi DOM elemen setiap section villa.
  // tujuannya agar kita bisa melakukan scroll otomatis ke elemen tersebut.
  const sectionRefs = useRef([]);

  // 3. SCROLL FUNCTION: Fungsi untuk mengarahkan layar ke villa yang dipilih.
  // Mencari elemen berdasarkan ID dan menjalankan fungsi scroll halus (smooth scroll).
  const scrollToVilla = (id) => {
    const target = sectionRefs.current.find((ref) => ref?.id === id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full bg-background text-foreground py-16 transition-colors duration-500">
      
      {/* 4. HEADER: Judul bagian koleksi rumah */}
      <div className="text-center mb-10 px-6 md:px-16">
        <h3 className="text-[16px] font-semibold uppercase tracking-wider font-medium opacity-80 text-primary">
          Find the home that fits your lifestyle and future
        </h3>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">House Collections</h1>
      </div>

      {/* 5. NAVIGATION BUTTONS: Menampilkan daftar tombol villa.
          Melakukan mapping dari data 'villas' untuk membuat tombol navigasi. */}
      <div className="flex flex-wrap justify-center gap-8 px-6 md:px-16 mb-12">
        {villas.map((villa) => (
          <VillaButton 
            key={villa.id} 
            name={villa.name} 
            onClick={() => scrollToVilla(villa.id)} 
          />
        ))}
      </div>

      {/* 6. VILLA CONTENT (SLIDERS): Menampilkan konten utama setiap villa.
          - Menggunakan mapping dari data 'villas'.
          - Menyimpan referensi elemen ke 'sectionRefs'.
          - Memberikan props 'reversed' dan 'blueTheme' secara selang-seling (index % 2) 
            agar tampilan UI tidak membosankan (Z-Layout). */}
      <div className="flex flex-col gap-20">
        {villas.map((villa, index) => (
          <div 
            key={villa.id} 
            id={villa.id} 
            ref={(el) => (sectionRefs.current[index] = el)}
          >
            <VillaSlider
              name={villa.name}
              slides={villa.slides}
              reversed={index % 2 === 1} // Index ganjil akan memiliki tata letak terbalik
              blueTheme={index % 2 === 0} // Index genap menggunakan tema biru
            />
          </div>
        ))}
      </div>
    </section>
  );
};