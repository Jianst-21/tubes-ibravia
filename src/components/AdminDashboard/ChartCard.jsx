import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from "recharts";

// 1. KONSTANTA: Daftar nama hari untuk keperluan label pada sumbu X
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * 2. FUNGSI HELPER: getCeilingAndStep
 * Menentukan batas atas (upper bound) dan rentang angka (step) pada sumbu Y 
 * secara dinamis berdasarkan nilai data tertinggi agar chart terlihat proporsional.
 */
function getCeilingAndStep(maxVal) {
  if (maxVal <= 5) return { upper: 5, step: 1 };
  if (maxVal <= 20) return { upper: 20, step: 5 };
  if (maxVal <= 50) return { upper: 50, step: 10 };

  const upper = Math.ceil(maxVal / 50) * 50;
  return { upper, step: 10 };
}

/**
 * 3. FUNGSI HELPER: buildTicks
 * Membuat array angka untuk titik-titik (ticks) pada sumbu Y 
 * berdasarkan batas atas dan step yang sudah dihitung.
 */
function buildTicks(upper, step) {
  const ticks = [];
  for (let v = 0; v <= upper; v += step) ticks.push(v);
  return ticks;
}

/**
 * 4. KOMPONEN CUSTOM: ChartBorder
 * Menggambar kotak border di area plot chart menggunakan elemen SVG <rect>.
 * Mengambil koordinat dari props 'offset' yang disediakan oleh Recharts.
 */
const ChartBorder = ({ offset }) => {
  if (!offset) return null;
  const { left, top, width, height } = offset;

  return (
    <rect
      x={left}
      y={top}
      width={width}
      height={height}
      fill="none"
      stroke="#D1D5DB"
      strokeWidth={1}
    />
  );
};

/**
 * 5. KOMPONEN UTAMA: ChartCard
 * Menampilkan kartu berisi grafik garis (Line Chart) untuk statistik mingguan.
 */
const ChartCard = ({ data = [] }) => {
  // A. LOGIKA DATA: Mengambil nilai numerik dan mencari nilai tertinggi
  const values = (data ?? []).map((d) => Number(d?.value) || 0);
  const maxVal = Math.max(0, ...values);

  // B. LOGIKA SKALA: Menghitung ticks untuk sumbu Y
  const { upper, step } = getCeilingAndStep(maxVal);
  const ticks = buildTicks(upper, step);

  // C. LOGIKA WAKTU: Mendapatkan informasi bulan, tahun, dan minggu ke-berapa saat ini
  const now = new Date();
  const monthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(now);

  const weekOfMonth = Math.ceil(now.getDate() / 7);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      
      {/* 6. HEADER KARTU: Menampilkan info minggu dan bulan/tahun */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <h2 className="text-gray-800 font-semibold text-lg">Week {weekOfMonth}</h2>
        <p className="text-sm font-bold text-gray-700">{monthYear}</p>
      </div>

      {/* 7. CHART CONTAINER: Pembungkus grafik dengan tinggi tetap (190px) */}
      <div className="w-full h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 10 }}>
            {/* Grid latar belakang */}
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" vertical horizontal />

            {/* Konfigurasi Sumbu X (Hari) */}
            <XAxis
              dataKey="day"
              ticks={[1, 2, 3, 4, 5, 6, 7]}
              tickFormatter={(v) => (DAYS[v - 1] ? DAYS[v - 1] : "")}
              interval={0}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Konfigurasi Sumbu Y (Nilai/Jumlah) */}
            <YAxis
              domain={[0, upper]}
              ticks={ticks}
              allowDecimals={false}
              padding={{ top: 12, bottom: 0 }}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip saat hover: Menampilkan detail data di titik tertentu */}
            <Tooltip
              cursor={{ stroke: "#9CA3AF", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                fontSize: "12px",
                padding: "6px 10px",
              }}
              labelFormatter={(label) => DAYS[label - 1] ?? label}
            />

            {/* Memasukkan Border Custom ke dalam Chart */}
            <Customized component={ChartBorder} />

            {/* Konfigurasi Garis Grafik */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4B5563"
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 3, fill: "#111827" }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;