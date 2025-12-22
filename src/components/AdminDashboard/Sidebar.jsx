import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  ClipboardList,
  HousePlus,
  BellRing,
  CalendarClock,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import apiAdmin from "../../api/apiadmin";
import LogoPutih from "/src/assets/images/logo/Logo Putih.png";
import supabaseRealtime from "../../config/supabaseclientFrontend";

/**
 * Komponen Sidebar
 * Berfungsi sebagai navigasi utama admin dan mengelola sistem notifikasi realtime.
 */
const Sidebar = () => {
  const location = useLocation(); // Mengambil info rute saat ini untuk styling "active link"
  const navigate = useNavigate(); // Hook untuk berpindah halaman secara programatik
  const [notifCount, setNotifCount] = useState(0); // State jumlah notifikasi yang belum dibaca
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State kontrol modal konfirmasi logout

  // 1. EFFECT: Mengelola pengambilan data awal & sistem Realtime (Supabase)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ENABLE_LOG = false; // Flag untuk mengaktifkan/mematikan log debug

    // A. Fungsi pengambil data notifikasi dari API
    const fetchNotifCount = async () => {
      try {
        const res = await apiAdmin.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter notifikasi yang belum dibaca
        const unreadCount = res.data.filter((n) => n.read_status !== "read").length;
        setNotifCount(unreadCount);
      } catch (err) {
        if (ENABLE_LOG) console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifCount(); // Ambil data saat pertama kali render

    // B. Konfigurasi Realtime Supabase
    // Mendengarkan perubahan (INSERT/UPDATE/DELETE) pada tabel 'notification' secara langsung
    const channel = supabaseRealtime
      .channel("admin-notification-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification" },
        (payload) => {
          if (ENABLE_LOG) console.log("🔔 Notifikasi berubah:", payload.eventType);
          fetchNotifCount(); // Refresh jumlah notifikasi jika ada perubahan di database
        }
      )
      .subscribe();

    // C. Event Listener Custom: Digunakan jika ada update manual dari komponen lain
    window.addEventListener("notifUpdated", fetchNotifCount);

    // D. CLEANUP: Membersihkan listener saat komponen dibongkar (unmount)
    return () => {
      window.removeEventListener("notifUpdated", fetchNotifCount);
      try {
        supabaseRealtime.removeChannel(channel);
      } catch (err) {
        if (ENABLE_LOG) console.warn("Gagal remove channel:", err);
      }
    };
  }, []);

  // 2. LOGOUT LOGIC: Fungsi untuk mengelola proses keluar akun
  const handleLogoutClick = () => setShowLogoutModal(true); // Buka modal
  const cancelLogout = () => setShowLogoutModal(false); // Tutup modal

  const confirmLogout = () => {
    localStorage.clear(); // Hapus token & data session
    navigate("/"); // Kembali ke halaman login/utama
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* 3. SIDEBAR CONTAINER: Layout tetap di sisi kiri */}
      <div className="w-64 h-screen bg-[#0B3C78] text-white flex flex-col justify-between py-6 font-sans shadow-lg overflow-hidden fixed left-0 top-0 z-40">
        
        {/* bagian Atas: Logo & Navigasi */}
        <div>
          {/* Logo Brand */}
          <div className="flex items-end gap-5 px-6 mb-7 justify-center">
            <img
              src={LogoPutih}
              alt="Ibravia Logo"
              className="w-10 h-10 object-contain pb-[6px] scale-160 transition-transform duration-300"
            />
            <h1 className="text-[32px] font-bold tracking-wide">IBRAVIA</h1>
          </div>

          {/* Menu Navigasi Link */}
          <nav className="flex flex-col space-y-3 px-4 text-base font-medium">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/dashboard"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02]"
              }`}
            >
              <LineChart size={19} />
              Dashboard
            </Link>

            {/* Menu lainnya (Manage Reservation, House, Report) */}
            <Link
              to="/admin/manage-reservation"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/manage-reservation"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02]"
              }`}
            >
              <CalendarClock size={19} />
              Manage Reservation
            </Link>

            <Link
              to="/admin/manage-house"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/manage-house"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02]"
              }`}
            >
              <HousePlus size={19} />
              Manage House
            </Link>

            <Link
              to="/admin/data-report"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/data-report"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02]"
              }`}
            >
              <ClipboardList size={19} />
              Reservation Report
            </Link>

            {/* Link Notifikasi dengan Badge angka */}
            <Link
              to="/admin/notification"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg relative transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/notification"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02]"
              }`}
            >
              <BellRing size={19} />
              <span className="flex-1">Notifications</span>

              {/* Badge Angka: Hanya muncul jika ada notif > 0 */}
              {notifCount > 0 && (
                <span
                  className="absolute right-4 bg-white text-[#0B3C78] text-[11px] font-bold
                               px-2.5 py-[1px] rounded-full shadow-sm border border-[#0B3C78]"
                >
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </Link>

            <div className="border-t-2 border-white my-4"></div>
          </nav>
        </div>

        {/* Bagian Bawah: Tombol Logout */}
        <div className="px-4">
          <button
            onClick={handleLogoutClick}
            className="w-full border border-white text-white font-semibold py-2 rounded-lg 
                       hover:bg-white hover:text-[#D32F2F] hover:border-transparent 
                       transition-all duration-200 flex justify-center items-center gap-2 
                       cursor-pointer hover:scale-[1.02]"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* 4. LOGOUT MODAL: Ditampilkan secara kondisional (Overlay & Dialog) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Backdrop gelap transparan */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={cancelLogout}
          ></div>

          {/* Konten Modal Konfirmasi */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-sm p-6 relative z-10 transform transition-all scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out Confirmation</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to log out from this account? You’ll need to log in again to
                access the admin panel.
              </p>
              {/* Tombol Aksi Modal */}
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl
                             hover:bg-gray-200 transition-colors duration-200 cursor-pointer
                             hover:scale-[1.02]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 bg-[#0F62FF] text-white font-medium rounded-xl
                             hover:bg-[#092C5A] transition-colors duration-200 flex items-center justify-center gap-2 
                             cursor-pointer hover:scale-[1.02]"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;