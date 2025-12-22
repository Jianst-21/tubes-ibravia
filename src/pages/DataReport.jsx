import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import apiAdmin from "../api/apiadmin";
import { Printer, ChevronLeft, ChevronRight, FileText } from "lucide-react";

/**
 * Komponen AdminDataReport
 * Berfungsi untuk menampilkan laporan riwayat reservasi dalam bentuk tabel.
 * Dilengkapi dengan fitur pagination (halaman) dan fungsi cetak laporan (Print).
 */
export default function AdminDataReport() {
  // 1. STATE MANAGEMENT
  const [report, setReport] = useState([]);         // Menyimpan seluruh data laporan dari API
  const [loading, setLoading] = useState(true);      // Melacak status loading saat fetch data
  const [currentPage, setCurrentPage] = useState(1); // Menentukan halaman tabel yang sedang aktif
  const itemsPerPage = 10;                           // Batasan jumlah baris data per halaman
  const tableRef = useRef(null);                     // Referensi DOM untuk elemen tabel

  // 2. EFFECT: Mengambil data laporan saat pertama kali halaman dimuat
  useEffect(() => {
    fetchReport();
  }, []);

  /**
   * 3. FUNGSI FETCH DATA: fetchReport
   * Mengambil data laporan reservasi dari backend menggunakan instance apiAdmin.
   */
  const fetchReport = async () => {
    setLoading(true);
    try {
      // Mengambil token (jika diperlukan oleh interceptor) dan merequest data report
      const res = await apiAdmin.get("/report");
      setReport(res.data);
    } catch (err) {
      console.error("Gagal mengambil data report:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 4. FUNGSI PRINT: handlePrint
   * Membuka dialog cetak browser. CSS khusus digunakan untuk menyembunyikan sidebar saat dicetak.
   */
  const handlePrint = () => {
    window.print();
  };

  // 5. LOGIKA PAGINATION: Menghitung data yang harus ditampilkan pada halaman aktif
  const totalPages = Math.ceil(report.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = report.slice(startIndex, startIndex + itemsPerPage);

  // Fungsi navigasi ke halaman sebelumnya
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Fungsi navigasi ke halaman berikutnya
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  /**
   * 6. HELPER STYLE: getStatusColorClass
   * Menentukan warna teks, background, dan border pada badge status (Accepted/Cancelled).
   */
  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "text-[#249A42] bg-white border-[#249A42]";
      case "cancelled":
        return "text-[#B93227] bg-white border-[#B93227]";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5FAFF] font-sans print:bg-white">
      {/* SIDEBAR: Disembunyikan saat mode cetak (print:hidden) */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#F5FAFF] shadow-lg z-20 print:hidden">
        <Sidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 ml-64 transition-all duration-300 print:ml-0 print:p-0 print:w-full">
        
        {/* HEADER: Judul Laporan dan Tombol Cetak */}
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <div>
            <h1 className="text-[48px] font-bold text-gray-900 print:text-2xl -mt-8">
              Reservation Report
            </h1>
            <p className="text-gray-500 mt-1 print:text-sm">
              Report of reservations that were received and canceled.
            </p>
          </div>

          {/* Tombol Cetak (Hanya muncul di layar, tidak di kertas/PDF) */}
          <button
            onClick={handlePrint}
            className="print:hidden bg-[#0F62FF] hover:bg-[#0D56E0] text-white px-5 py-2.5 rounded-lg 
            flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 font-medium 
            cursor-pointer hover:scale-[1.03] active:scale-95"
          >
            <Printer size={18} />
            Print Report
          </button>
        </div>

        {/* TABEL LAPORAN */}
        <div
          ref={tableRef}
          className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200 print:shadow-none 
          print:border-0 print:rounded-none"
        >
          <table className="min-w-full text-sm text-left text-gray-700 print:border-collapse print:w-full">
            <thead
              className="bg-[#0B3C78] text-white text-xs uppercase tracking-wider font-semibold 
            print:bg-gray-100 print:text-black"
            >
              <tr>
                <th className="px-6 py-4 rounded-tl-xl print:rounded-none print:border print:border-gray-300">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-center print:border print:border-gray-300">Block</th>
                <th className="px-6 py-4 text-center print:border print:border-gray-300">
                  Number House
                </th>
                <th className="px-6 py-4 print:border print:border-gray-300">Reservation Date</th>
                <th
                  className="px-6 py-4 rounded-tr-xl print:rounded-none print:border 
                print:border-gray-300 text-center"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 print:divide-gray-300">
              {/* TAMPILAN LOADING: Muncul saat data sedang diambil */}
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B3C78] mb-2"></div>
                      Loading report data...
                    </div>
                  </td>
                </tr>
              ) : report.length === 0 ? (
                /* TAMPILAN KOSONG: Jika API tidak mengembalikan data */
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText size={48} strokeWidth={1} className="mb-4" />
                      <p className="text-lg font-medium text-gray-500">
                        There is no report data yet.{" "}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* DATA MAPPING: Merender baris data laporan */
                currentData.map((item, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-gray-50 transition-colors print:hover:bg-transparent ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50 print:bg-transparent"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 print:border print:border-gray-300">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center print:border print:border-gray-300">
                      {item.block_name}
                    </td>
                    <td className="px-6 py-4 text-center print:border print:border-gray-300">
                      {item.number_house}
                    </td>
                    <td className="px-6 py-4 print:border print:border-gray-300">
                      {/* Format Tanggal Indonesia (misal: 23 Desember 2025) */}
                      {item.date
                        ? new Date(item.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 print:border print:border-gray-300 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border 
                          capitalize print:border-0 print:px-0 print:py-0 print:bg-transparent print:text-black 
                          ${getStatusColorClass(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* KONTROL PAGINATION: Hanya muncul jika data lebih dari batasan baris */}
        {report.length > itemsPerPage && (
          <div className="flex justify-center items-center mt-8 gap-6 print:hidden">
            {/* Tombol Halaman Sebelumnya */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 
              bg-white text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Indikator Nomor Halaman */}
            <span className="text-lg font-semibold text-gray-700">{currentPage}</span>

            {/* Tombol Halaman Selanjutnya */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 
              bg-white text-gray-600 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 
              disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {/* STYLE KHUSUS PRINT: Memaksa warna muncul di cetakan fisik/PDF */}
      <style>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          /* Memastikan background warna badge/tabel muncul saat di-print */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}