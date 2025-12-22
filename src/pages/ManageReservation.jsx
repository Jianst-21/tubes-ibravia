import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import {
  Loader2,
  CheckCircle,
  Info,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import apiAdmin from "../api/apiadmin";

/**
 * Helper Function: formatStatus
 * Mengubah string status (misal: "pending") menjadi format kapital (misal: "Pending").
 */
const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

/**
 * Komponen ManageReservation
 * Berfungsi sebagai panel kontrol bagi Admin untuk menyetujui (Accept) 
 * atau membatalkan (Cancel) reservasi yang diajukan oleh pengguna.
 */
const ManageReservation = () => {
  // 1. STATE MANAGEMENT
  const [reservations, setReservations] = useState([]); // Data reservasi dari server
  const [isLoading, setIsLoading] = useState(true);      // Loading saat pertama kali fetch data
  const [isActionLoading, setIsActionLoading] = useState(false); // Loading saat memproses tombol Accept/Cancel
  const [removingId, setRemovingId] = useState(null);    // Melacak ID yang sedang dihapus untuk animasi transisi

  // State untuk mengontrol Modal Konfirmasi (sebelum aksi dieksekusi)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'accept' atau 'cancel'
    id_reservasi: null,
    id_house: null,
  });

  // State untuk mengontrol Pop-up Sukses (setelah aksi berhasil)
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    type: null,
  });

  /**
   * 2. DATA FETCHING: fetchReservations
   * Mengambil daftar reservasi masuk dari API Admin.
   * Menggunakan useCallback agar fungsi ini stabil dan tidak memicu re-render yang tidak perlu.
   */
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiAdmin.get("/manage-reservation");
      setReservations(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      toast.error("Failed to load reservation data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 3. HANDLERS: Mengontrol buka/tutup Modal Konfirmasi
  const openModal = (type, id_reservasi, id_house) => {
    setActionModal({
      isOpen: true,
      type,
      id_reservasi,
      id_house,
    });
  };

  const closeModal = () => {
    setActionModal({
      isOpen: false,
      type: null,
      id_reservasi: null,
      id_house: null,
    });
  };

  /**
   * 4. LOGIKA EKSEKUSI AKSI: executeAction
   * Alur: Tutup modal konfirmasi -> Hit API -> Munculkan Modal Sukses -> 
   * Tunggu 2 detik -> Jalankan animasi hapus dari list.
   */
  const executeAction = async () => {
    const { type, id_reservasi, id_house } = actionModal;
    if (!type || !id_reservasi) return;

    setIsActionLoading(true);

    try {
      const endpoint = type === "accept" ? "/accept-reservation" : "/cancel-reservation";

      // Kirim permintaan ke server
      await apiAdmin.post(endpoint, { id_reservasi, id_house });

      // Langkah 1: Tutup modal konfirmasi
      closeModal();

      // Langkah 2: Tampilkan Modal Sukses Besar (Feedback Visual)
      setSuccessModal({ isOpen: true, type });

      // Langkah 3: Jeda waktu untuk UX (User Experience)
      setTimeout(() => {
        setSuccessModal({ isOpen: false, type: null }); // Tutup modal sukses

        // Langkah 4: Jalankan animasi 'fade-out' pada baris list yang diproses
        setRemovingId(id_reservasi);
        setTimeout(() => {
          // Hapus data dari state lokal secara permanen
          setReservations((prev) => prev.filter((r) => r.id_reservasi !== id_reservasi));
          setRemovingId(null);
        }, 400); // Durasi animasi CSS
      }, 2000); 

    } catch (err) {
      console.error(`Gagal memproses aksi:`, err);
      toast.error(err.response?.data?.error || "An error occurred while processing.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] flex relative font-sans">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />

      <Sidebar />
      
      <main className="flex-1 pl-72 pr-8 py-8 bg-[#F5FAFF]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[48px] font-bold text-[#0E1315] -mt-8 mb-4">Manage Reservation</h1>

          {/* Kondisi Loading Awal */}
          {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#0B3C78] mr-2" />
              <p className="text-[#0B3C78] font-semibold">Loading reservation data...</p>
            </div>
          ) : reservations.length === 0 ? (
            /* Kondisi Jika Data Kosong */
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border border-gray-200 mt-10">
              <Info className="w-10 h-10 text-gray-400 mb-4" />
              <p className="text-center text-gray-500 text-lg font-medium">There is no reservation data at the moment.</p>
            </div>
          ) : (
            /* Render Daftar Kartu Reservasi */
            <div className="flex flex-col gap-4">
              {reservations.map((item) => {
                const deadlineDate = new Date(item.deadline_date).toLocaleDateString("en-GB");
                const isPending = item.status?.toLowerCase() === "pending";
                const displayStatus = formatStatus(item.status);

                return (
                  <div
                    key={item.id_reservasi}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full transition-all duration-500 border-b-4 border-b-black ${
                      // Logika Animasi: Jika ID ini sedang dihapus, kurangi opacity dan scale
                      removingId === item.id_reservasi
                        ? "opacity-0 translate-y-4 scale-95"
                        : "hover:shadow-md"
                    }`}
                  >
                    {/* Header Kartu: Blok & Nama Residence */}
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <p className="text-[#0B3C78] font-bold text-[24px] tracking-wide uppercase">
                          Block {item.block_name} • No. {item.number_house}
                        </p>
                        <h2 className="text-[40px] font-bold text-0E1315 mt-1">{item.residence_name}</h2>
                      </div>

                      {/* Info Status & Tanggal Deadline */}
                      <div className="flex flex-col items-end gap-3">
                        <span className={`rounded-full capitalize inline-flex items-center justify-center h-8 min-w-[96px] px-4 text-[16px] font-semibold tracking-wider bg-white border border-[1.5px] border-current
                          ${isPending ? "text-[#C5880A]" : "text-[#249A42]"}`}>
                          {displayStatus}
                        </span>

                        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full">
                          <div className="grid grid-cols-[auto_1fr] gap-x-2 text-sm font-medium text-[#0E1315]">
                            <span>Reservation</span><span>: {new Date(item.reservation_date).toLocaleDateString("en-GB")}</span>
                            <span>Deadline</span><span>: {deadlineDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100 mb-5" />

                    {/* Body Kartu: Info Customer & Properti */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div className="space-y-3">
                        <div>
                          <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">Customer Info</span>
                          <p className="text-[#0E1315] font-normal">{item.name}</p>
                          <p className="text-[#0E1315]">{item.email}</p>
                        </div>
                        <div>
                          <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">Address</span>
                          <p className="font-normal text-[#0E1315] leading-relaxed">{item.address}</p>
                        </div>
                      </div>
                      <div className="space-y-3 md:border-l md:pl-6 border-gray-100">
                        <div>
                          <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">Property Details</span>
                          <p className="text-[#0E1315] leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex gap-6 mt-8">
                          <div>
                            <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">Land Area</span>
                            <p className="font-normal text-[#0E1315]">{item.land_area} m²</p>
                          </div>
                          <div>
                            <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">House Area</span>
                            <p className="text-[#0E1315] font-normal">{item.building_area} m²</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Kartu: Tombol Aksi (Hanya muncul jika status Pending) */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                      {isPending ? (
                        <>
                          <button onClick={() => openModal("cancel", item.id_reservasi, item.id_house)} disabled={isActionLoading} className="px-6 py-2.5 rounded-lg font-semibold text-[#B93227] border border-[#B93227] hover:bg-red-50 transition-all active:scale-95 cursor-pointer">Cancel</button>
                          <button onClick={() => openModal("accept", item.id_reservasi, item.id_house)} disabled={isActionLoading} className="px-6 py-2.5 rounded-lg font-semibold text-white bg-[#0F62FF] hover:opacity-90 transition-all active:scale-95 cursor-pointer">Accept</button>
                        </>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full italic">
                          <CheckCircle className="w-4 h-4 mr-2 text-gray-400" /> Reservasi ini telah selesai diproses.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODAL KONFIRMASI: Memastikan Admin tidak salah klik aksi */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-center text-[#0E1315] mb-2">
              {actionModal.type === "accept" ? "Accept Reservation" : "Cancel Reservation"}
            </h3>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <p className="text-gray-600 text-center mb-8 text-lg">
              {actionModal.type === "accept" ? "Are you sure you want to approve this?" : "Are you sure you want to reject this?"}
            </p>
            <div className="flex justify-evenly mt-4">
              <button onClick={closeModal} className="w-36 py-3 rounded-lg font-bold text-[#0B3C78] bg-blue-50 hover:bg-blue-100">Dismiss</button>
              <button onClick={executeAction} className={`w-36 py-3 rounded-lg font-bold text-white ${actionModal.type === "accept" ? "bg-[#0F62FF]" : "bg-[#B93227]"}`}>
                {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (actionModal.type === "accept" ? "Accept" : "Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP SUKSES: Konfirmasi visual besar bahwa data berhasil diupdate di database */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[30px] p-8 md:p-10 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 scale-100 animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#E6EEFF" }}>
              <Check className="w-12 h-12" strokeWidth={3} style={{ color: "#0F62FF" }} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0E1315] text-center mb-3">
              {successModal.type === "accept" ? "Reservation Accepted!" : "Reservation Canceled"}
            </h2>
            <p className="text-gray-500 text-center text-base leading-relaxed">The reservation has been successfully processed. Updating list...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReservation;