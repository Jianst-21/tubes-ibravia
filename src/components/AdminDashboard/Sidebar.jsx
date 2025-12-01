import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  ClipboardList,
  HousePlus,
  BellRing,
  CalendarClock,
  LogOut,
  AlertTriangle,
  X,
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

    const fetchNotif = async () => {
      try {
        const res = await apiAdmin.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unread = res.data.filter((n) => n.read_status !== "read").length;
        setNotifCount(unread);
      } catch {}
    };

    fetchNotif();

    const channel = supabaseRealtime
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notification" }, fetchNotif)
      .subscribe();

    return () => supabaseRealtime.removeChannel(channel);
  }, []);

  const navStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all";

  const active = (path) =>
    location.pathname === path
      ? "bg-white text-[#0B3C78] font-semibold shadow-sm"
      : "hover:bg-white hover:text-[#0B3C78]";

  return (
    <div className="w-64 h-full bg-[#0B3C78] text-white flex flex-col justify-between py-6 shadow-xl overflow-hidden">
      <div>
        <div className="flex items-end gap-4 px-6 mb-8 justify-center">
          <img src={LogoPutih} className="w-10 h-10 pb-[6px]" />
          <h1 className="text-2xl font-bold">IBRAVIA</h1>
        </div>

        <nav className="flex flex-col space-y-3 px-4 text-base font-medium">
          <Link className={`${navStyle} ${active("/admin/dashboard")}`} to="/admin/dashboard">
            <LineChart size={19} /> Dashboard
          </Link>

          <Link className={`${navStyle} ${active("/admin/manage-reservation")}`} to="/admin/manage-reservation">
            <CalendarClock size={19} /> Manage Reservation
          </Link>

          <Link className={`${navStyle} ${active("/admin/manage-house")}`} to="/admin/manage-house">
            <HousePlus size={19} /> Manage House
          </Link>

          <Link className={`${navStyle} ${active("/admin/data-report")}`} to="/admin/data-report">
            <ClipboardList size={19} /> Reservation Report
          </Link>

          <Link className={`${navStyle} ${active("/admin/notification")} relative`} to="/admin/notification">
            <BellRing size={19} />
            <span className="flex-1">Notifications</span>
            {notifCount > 0 && (
              <span className="absolute right-4 bg-white text-[#0B3C78] text-[11px] font-bold px-2 py-[1px] rounded-full">
                {notifCount}
              </span>
            )}
          </Link>

          <div className="border-t border-white my-4" />
        </nav>
      </div>

      <div className="px-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-2 border border-white rounded-lg hover:bg-white hover:text-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutModal(false)} />
          <div className="bg-white p-6 rounded-2xl max-w-sm z-10">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 bg-gray-100" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
