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

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ENABLE_LOG = false; // <<< MATIKAN LOG DARI SINI

    const fetchNotifCount = async () => {
      try {
        const res = await apiAdmin.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unreadCount = res.data.filter((n) => n.read_status !== "read").length;
        setNotifCount(unreadCount);
      } catch (err) {
        if (ENABLE_LOG) console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifCount();

    if (ENABLE_LOG) console.log("🟢 Realtime listener aktif...");

    const channel = supabaseRealtime
      .channel("admin-notification-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification" },
        (payload) => {
          if (ENABLE_LOG) console.log("🔔 Notifikasi berubah:", payload.eventType);
          fetchNotifCount();
        }
      )
      .subscribe((status) => {
        if (ENABLE_LOG) console.log("Realtime status:", status);
      });

    window.addEventListener("notifUpdated", fetchNotifCount);

    return () => {
      window.removeEventListener("notifUpdated", fetchNotifCount);
      try {
        supabaseRealtime.removeChannel(channel);
        if (ENABLE_LOG) console.log("🧹 Realtime listener dibersihkan");
      } catch (err) {
        if (ENABLE_LOG) console.warn("Gagal remove channel:", err);
      }
    };
  }, []);

  // --- Logout logic ---
  const handleLogoutClick = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="w-64 h-screen bg-[#0B3C78] text-white flex flex-col justify-between py-6 font-sans shadow-lg overflow-hidden fixed left-0 top-0 z-40">
        {/* 🏙️ Logo */}
        <div>
          <div className="flex items-end gap-5 px-6 mb-7 justify-center">
            <img
              src={LogoPutih}
              alt="Ibravia Logo"
              className="w-10 h-10 object-contain pb-[6px] scale-160 transition-transform duration-300"
            />
            <h1 className="text-2xl font-bold tracking-wide">IBRAVIA</h1>
          </div>

          {/* 📋 Navigation */}
          <nav className="flex flex-col space-y-3 px-4 text-base font-medium">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/dashboard"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02] transition-transform"
              }`}
            >
              <LineChart size={19} />
              Dashboard
            </Link>

            <Link
              to="/admin/manage-reservation"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/manage-reservation"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02] transition-transform"
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
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02] transition-transform"
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
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02] transition-transform"
              }`}
            >
              <ClipboardList size={19} />
              Reservation Report
            </Link>

            {/* 🔔 Notification */}
            <Link
              to="/admin/notification"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg relative transition-all duration-200 cursor-pointer ${
                location.pathname === "/admin/notification"
                  ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
                  : "hover:bg-white hover:text-[#0B3C78] hover:scale-[1.02] transition-transform"
              }`}
            >
              <BellRing size={19} />
              <span className="flex-1">Notifications</span>

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

        {/* 🚪 Logout Button */}
        <div className="px-4">
          <button
            onClick={handleLogoutClick}
            className="w-full border border-white text-white font-semibold py-2 rounded-lg 
                       hover:bg-white hover:text-[#D32F2F] hover:border-transparent 
                       transition-all duration-200 flex justify-center items-center gap-2 
                       cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={cancelLogout}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative z-10 transform transition-all scale-100">
            {/* --- CONFIRMATION VIEW ONLY --- */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out Confirmation</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to log out from this account? You’ll need to log in again to
                access the admin panel.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl
                             hover:bg-gray-200 transition-colors duration-200 cursor-pointer
                             hover:scale-[1.02] transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 bg-[#0F62FF] text-white font-medium rounded-xl
                             hover:bg-[#092C5A] transition-colors duration-200 flex items-center justify-center gap-2 
                             cursor-pointer hover:scale-[1.02] transition-transform"
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
