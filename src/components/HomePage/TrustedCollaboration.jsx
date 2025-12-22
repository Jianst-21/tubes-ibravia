import { motion } from "framer-motion";
import ptBangunPersada from "../../assets/images/pt/Persada.png";
import ptBumiMoroAgung from "../../assets/images/pt/BumiMoro.png";
import ptTotalBumiArtha from "../../assets/images/pt/Total.png";

/**
 * Data daftar mitra pengembang (developer) yang bekerja sama.
 * Disimpan dalam array objek agar mudah dikelola dan di-render secara dinamis.
 */
const partners = [
  { id: 1, name: "PT Bangun Persada Property", logo: ptBangunPersada },
  { id: 2, name: "PT Bumi Moro Agung", logo: ptBumiMoroAgung },
  { id: 3, name: "PT Total Bumi Artha Raya", logo: ptTotalBumiArtha },
];

/**
 * Komponen TrustedCollaboration
 * Menampilkan section kolaborasi dengan mitra pengembang menggunakan animasi scroll.
 */
export const TrustedCollaboration = () => {
  return (
    <section className="pt-12 pb-20 bg-[hsl(var(--background))] text-foreground">
      {/* 1. CONTAINER: Mengatur pembungkus utama dengan padding responsif sesuai standar Navbar */}
      <div className="w-full px-4 sm:px-8 lg:px-[80px] xl:px-[120px] mx-auto">
        
        {/* 2. HEADING SECTION: Berisi judul dan teks pengantar bagian kolaborasi */}
        <div className="text-center">
          <p className="text-[16px] font-semibold text-primary uppercase tracking-wider mb-2">
            We Proudly Present
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Our Trusted Collaboration</h2>
        </div>

        {/* 3. GRID SYSTEM: Menampilkan daftar mitra dalam layout kolom (1 di mobile, 3 di desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-24 pt-16 justify-center">
          {partners.map((partner, i) => (
            /**
             * 4. ANIMATION (Framer Motion):
             * - initial: Posisi awal (transparan & agak turun ke bawah).
             * - whileInView: Animasi berjalan saat elemen masuk ke layar (muncul & naik).
             * - transition: Durasi dan delay yang berbeda di tiap item agar muncul bergantian (staggered).
             */
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="w-full max-w-[309px] aspect-[309/306] bg-[hsl(var(--background))] rounded-2xl 
              shadow-[0_4px_12px_rgba(0,0,0,0.25)] 
              transition-transform duration-300 hover:scale-105 
              flex flex-col items-center justify-center mx-auto"
            >
              {/* Bagian Visual: Lingkaran Logo PT */}
              <div className="w-36 h-36 mb-6 rounded-full overflow-hidden shadow-md">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                />
              </div>

              {/* Teks Nama PT */}
              <p className="text-base font-semibold text-center">{partner.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};