/**
 * Komponen ReservationCard
 * Menampilkan detail spesifik dari sebuah reservasi rumah.
 * Menyertakan informasi blok, perumahan, deskripsi, serta rentang waktu reservasi.
 */
export default function ReservationCard({ data }) {
  
  /**
   * 1. FUNGSI FORMAT TANGGAL: formatDate
   * Mengubah format tanggal mentah (ISO string) menjadi format yang lebih manusiawi.
   * Contoh: "Monday, 12/23/2025 at 03:53 AM"
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${weekday}, ${month}/${day}/${year} at ${time}`;
  };

  /**
   * 2. HELPER WARNA: getStatusClasses
   * Menentukan class Tailwind untuk warna teks dan border berdasarkan status reservasi.
   * (Pending: Kuning/Emas, Accepted: Hijau, Canceled: Merah).
   */
  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "!text-[#C5880A] !border-[#C5880A]";
      case "accepted":
        return "!text-[#249A42] !border-[#249A42]";
      case "canceled":
        return "!text-[#B93227] !border-[#B93227]";
      default:
        return "!text-[#003B73] !border-[#003B73]";
    }
  };

  /**
   * 3. HELPER WARNA: getLeftBarColor
   * Menentukan warna latar belakang untuk garis dekoratif (status bar) di sisi paling kiri kartu.
   */
  const getLeftBarColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#C5880A]";
      case "accepted":
        return "bg-[#249A42]";
      case "canceled":
        return "bg-[#003B73]";
      default:
        return "bg-[#B93227]";
    }
  };

  return (
    <div
      className="
        relative border border-border bg-card rounded-2xl 
        shadow-lg transition-all duration-300
      "
    >
      {/* 4. LEFT STATUS BAR: Garis vertikal di sisi kiri yang menunjukkan status secara visual cepat */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${getLeftBarColor(
          data.reservation_status
        )}`}
      ></div>

      <div className="flex justify-between items-center p-6">
        
        {/* 5. MAIN CONTENT: Informasi teks detail perumahan */}
        <div className="ml-6 flex flex-col text-left flex-1">
          {/* Info Blok */}
          <h3 className="font-bold text-blue-800 dark:text-blue-400 text-sm">
            Block {data.block_name} {data.number_block}
          </h3>
          {/* Nama Perumahan */}
          <p className="font-semibold text-lg text-foreground">{data.residence_name}</p>

          {/* Deskripsi Properti */}
          <p className="text-sm text-muted-foreground mt-1">{data.description}</p>

          {/* Informasi Waktu: Start & End Date */}
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-semibold text-foreground">Start:</span>{" "}
              {formatDate(data.start_date)}
            </p>
            <p>
              <span className="font-semibold text-foreground">End:</span>{" "}
              {formatDate(data.end_date)}
            </p>
          </div>
        </div>

        {/* 6. STATUS BADGE: Label status di sisi kanan kartu dengan styling dinamis (inline style) */}
        <div className="ml-8 flex-shrink-0">
          <span
            className={`inline-block min-w-[120px] text-center px-6 py-2 rounded-lg font-semibold text-base`}
            style={{
              color:
                data.reservation_status === "pending"
                  ? "#C5880A"
                  : data.reservation_status === "accepted"
                    ? "#249A42"
                    : data.reservation_status === "canceled"
                      ? "#003B73"
                      : "#B93227",
              borderColor:
                data.reservation_status === "pending"
                  ? "#C5880A"
                  : data.reservation_status === "accepted"
                    ? "#249A42"
                    : data.reservation_status === "canceled"
                      ? "#003B73"
                      : "#B93227",
              backgroundColor: "var(--card)",
              borderStyle: "solid",
              borderWidth: "1px",
            }}
          >
            {/* Format teks: Mengubah status menjadi kapital di awal (misal: "pending" -> "Pending") */}
            {data.reservation_status.charAt(0).toUpperCase() + data.reservation_status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}