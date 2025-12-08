import { useState, useEffect } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import adminApi from "../api/apiadmin";
import { BellRing, CircleArrowRight } from "lucide-react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await adminApi.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Tambahkan properti read boolean
        const mapped = res.data.map((n) => ({
          ...n,
          read: n.read_status === "read",
        }));

        // Urutkan: belum dibaca di atas, lalu berdasarkan waktu terbaru
        const sorted = mapped.sort((a, b) => {
          if (a.read === b.read) {
            return new Date(b.send_time) - new Date(a.send_time);
          }
          return a.read ? 1 : -1;
        });

        setNotifications(sorted);
      } catch (err) {
        console.error("❌ Error fetching notifications:", err.response?.data || err.message);
      }
    };

    fetchNotifications();
  }, []);

  const handleSelect = async (n) => {
    setSelected(n);

    if (!n.read) {
      try {
        const token = localStorage.getItem("token");
        await adminApi.patch(`/notifications/${n.id_notification}/read`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications((prev) => {
          const updated = prev.map((notif) =>
            notif.id_notification === n.id_notification
              ? { ...notif, read: true, read_status: "read" }
              : notif
          );

          // Urutkan ulang setelah update
          return updated.sort((a, b) => {
            if (a.read === b.read) {
              return new Date(b.send_time) - new Date(a.send_time);
            }
            return a.read ? 1 : -1;
          });
        });
      } catch (err) {
        console.error("❌ Gagal update status notifikasi:", err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5FAFF] font-sans relative">
      {/* Sidebar  */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 ml-[260px] transition-all duration-300">
        <h1 className="text-[48px] font-bold text-gray-900 -mt-8 mb-8">Notification</h1>

        {/* Daftar Notifikasi */}
        <div className="space-y-5">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id_notification}
                onClick={() => handleSelect(n)}
                className={`flex justify-between items-center px-8 py-5 rounded-2xl shadow-md transition-all 
                  duration-200 cursor-pointer ${
                    n.read
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-[#0B3C78] text-white hover:bg-[#0d478b]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <BellRing size={28} />
                  <div>
                    <p className="text-lg font-semibold">New Message Received</p>
                    <p className={`text-sm mt-1 ${n.read ? "text-gray-600" : "text-gray-200"}`}>
                      {n.content}
                    </p>
                  </div>
                </div>
                <CircleArrowRight size={22} />
              </div>
            ))
          )}
        </div>

        {/* Popup Detail Notifikasi */}
        {selected && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition">
            <div className="bg-white rounded-2xl shadow-lg w-[400px] p-6 text-center relative">
              <h2 className="text-lg font-bold mb-2">Notification Detail</h2>
              <hr className="border-gray-300 mb-3" />
              <p className="text-sm text-gray-600 mb-6">{selected.content}</p>
              <p className="text-xs text-gray-400 mb-6">
                Time: {new Date(selected.send_time).toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="bg-[#0B3C78] hover:bg-[#0d478b] text-white px-6 py-2 rounded-full text-sm transition"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notification;
