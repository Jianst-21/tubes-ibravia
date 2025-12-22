import { useEffect, useState, useLayoutEffect } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import { BookText, BookCheck, BookX } from "lucide-react";
import ChartCard from "../components/AdminDashboard/ChartCard";
import apiadmin from "../api/apiadmin";
// Integrasi Realtime: Digunakan untuk sinkronisasi data instan dengan database
import supabaseRealtime from "../config/supabaseclientFrontend";

/**
 * Komponen StatCard (Sub-component)
 * Menampilkan kartu statistik individu untuk kategori Reserved, Sold, atau Cancelled.
 */
const StatCard = ({ title, value, type, className = "" }) => {
  // Mapping ikon berdasarkan tipe statistik
  const icons = {
    reserved: <BookText size={65} strokeWidth={1.5} className="text-white/90" />,
    sold: <BookCheck size={65} strokeWidth={1.5} className="text-white/90" />,
    cancelled: <BookX size={65} strokeWidth={1.5} className="text-white/90" />,
  };

  // Helper untuk format angka: menambahkan angka '0' di depan jika nilai < 10 (misal: 07)
  const formatValue = (val) => {
    if (val === 0) return "0";
    if (val < 10) return `0${val}`;
    return val;
  };

  return (
    <div
      className={`
        bg-[#0B3C78] text-white rounded-2xl shadow-md
        flex items-center justify-between
        p-4 sm:p-6 md:p-8
        h-28 sm:h-32 md:h-36
        w-[270px]
        transition-all duration-300
        ${className}
      `}
    >
      <div className="flex-shrink-0 opacity-90">{icons[type]}</div>

      <div className="text-right flex flex-col justify-center">
        <p className="text-sm md:text-base font-semibold tracking-wider uppercase opacity-80 mb-1">
          {title}
        </p>
        <p className="text-5xl md:text-6xl font-bold leading-none tracking-tight">
          {formatValue(parseInt(value))}
        </p>
      </div>
    </div>
  );
};

/**
 * Komponen Utama: AdminDashboard
 * Mengelola data ringkasan statistik dan grafik mingguan untuk panel admin.
 */
const AdminDashboard = () => {
  // 1. STATE MANAGEMENT
  const [stats, setStats] = useState({
    reserved: 0,
    sold: 0,
    cancelled: 0,
    weeklydata: [], // Menyimpan data untuk dirender oleh ChartCard
  });

  const [residenceName, setResidenceName] = useState(""); // Menyimpan nama perumahan yang dikelola admin

  // 2. LAYOUT EFFECT: Mengunci scroll pada body agar dashboard terlihat rapi (fixed view)
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle; // Kembalikan style saat pindah halaman
    };
  }, []);

  // 3. EFFECT UTAMA: Data Fetching & Realtime Setup
  useEffect(() => {
    // A. Fungsi mengambil data statistik & grafik dari backend
    const fetchDashboard = async () => {
      try {
        const res = await apiadmin.get("/dashboard");
        const result = res.data?.data || {};

        setStats({
          reserved: result.reserved_houses ?? 0,
          sold: result.total_houses ?? 0,
          cancelled: result.cancelled_reservations ?? 0,
          weeklydata: result.weeklydata ?? [], 
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    // B. Fungsi mengambil profil nama perumahan admin
    const fetchResidenceName = async () => {
      try {
        const res = await apiadmin.get("/residence-info");
        setResidenceName(res.data.name || "Unknown Residence");
      } catch (error) {
        console.error("Error fetching residence name:", error);
      }
    };

    fetchDashboard();
    fetchResidenceName();

    // C. REALTIME LISTENER: Memantau perubahan pada tabel 'reservation' di database.
    // Jika ada booking baru atau perubahan status, dashboard akan otomatis ter-update tanpa refresh.
    const channel = supabaseRealtime
      ?.channel?.("admin-dashboard-reservation-realtime")
      ?.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservation" },
        () => fetchDashboard()
      )
      ?.subscribe?.();

    // Cleanup: Mematikan koneksi realtime saat komponen ditinggalkan
    return () => {
      try {
        if (channel) supabaseRealtime.removeChannel(channel);
      } catch (err) {
        console.warn("Gagal remove channel:", err);
      }
    };
  }, []);

  return (
    <>
      {/* Navigasi Samping */}
      <Sidebar />

      {/* Kontainer Utama Dashboard */}
      <div className="fixed inset-y-0 left-64 right-0 bg-gray-50 flex flex-col justify-between overflow-hidden">
        <div className="px-6 sm:px-8 py-6 flex-1 flex flex-col">
          <div className="w-full">
            {/* Header: Nama Perumahan */}
            <h1 className="text-[48px] font-bold text-gray-900 -mt-6 mb-4">
              Dashboard {residenceName}
            </h1>

            {/* Area Grafik Statistik Mingguan */}
            <div className="mb-12 sm:mb-14 md:mb-20 lg:mb-[70px]">
              <ChartCard data={stats.weeklydata} />
            </div>

            {/* Grid Kartu Statistik Utama */}
            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                gap-6 sm:gap-10 md:gap-14 lg:gap-[54px]
              "
            >
              <StatCard title="RESERVED" value={stats.reserved} type="reserved" className="justify-self-start" />
              <StatCard title="SOLD" value={stats.sold} type="sold" className="justify-self-center" />
              <StatCard title="CANCELLED" value={stats.cancelled} type="cancelled" className="justify-self-end" />
            </div>

            {/* Spacer Bawah */}
            <div className="mt-12 sm:mt-14 md:mt-20 lg:mt-[70px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;