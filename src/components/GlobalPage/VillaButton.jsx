import { Home } from "lucide-react";

/**
 * Komponen VillaButton
 * Berfungsi sebagai tombol navigasi atau filter untuk memilih koleksi villa/perumahan tertentu.
 * Memiliki visualisasi kotak besar dengan ikon rumah di tengahnya.
 */
export const VillaButton = ({ name, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border text-sm sm:text-base 
    font-medium shadow-sm transition-all duration-300 cursor-pointer
    ${
      /* LOGIKA ACTIVE STATE: 
         Jika tombol aktif (dipilih), gunakan warna primary dan efek scale.
         Jika tidak, gunakan warna card standar dan efek hover.
      */
      active
        ? "bg-primary text-primary-foreground scale-[1.02] shadow-glow"
        : "bg-card text-foreground border-dynamic hover:scale-[1.02]"
    }`}
      style={{
        width: "240px",
        height: "240px",
        flexShrink: 0,
      }}
    >
      {/* ICON CONTAINER: Lingkaran di tengah yang membungkus ikon Lucide Home */}
      <div
        className="flex items-center justify-center rounded-full border-2 mb-3 transition-all duration-300"
        style={{
          width: "120px",
          height: "120px",
          borderColor: "hsl(var(--primary))",
          backgroundColor: active ? "hsl(var(--card))" : "transparent",
        }}
      >
        <Home
          size={64}
          strokeWidth={2.2}
          style={{
            color: "hsl(var(--primary))",
            transition: "transform 0.3s ease",
          }}
        />
      </div>

      {/* LABEL: Menampilkan nama villa/properti di bawah ikon */}
      <span className="text-center font-semibold leading-tight text-base">{name}</span>
    </button>
  );
};