import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import {
  Loader2,
  CheckCircle,
  Info,
  Check, // Tambahkan import Check untuk ikon yang lebih mirip
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import apiAdmin from "../api/apiadmin";

// --- Helper Function ---
const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const ManageReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null,
    id_reservasi: null,
    id_house: null,
  });

  // State baru untuk Pop-up Sukses ala Screenshot
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    type: null, // 'accept' atau 'cancel'
  });

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiAdmin.get("/manage-reservation");
      console.log(res.data);

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

  const executeAction = async () => {
    const { type, id_reservasi, id_house } = actionModal;
    if (!type || !id_reservasi) return;

    setIsActionLoading(true);
    // Opsional: Jika ingin tanpa loading toast karena akan ada modal sukses besar
    // const loadingToast = toast.loading("Processing...");

    try {
      const token = localStorage.getItem("token");
      const endpoint = type === "accept" ? "/accept-reservation" : "/cancel-reservation";

      await apiAdmin.post(endpoint, { id_reservasi, id_house });

      // Tutup modal konfirmasi dulu
      closeModal();
      // if (loadingToast) toast.dismiss(loadingToast);

      // Tampilkan Modal Sukses Besar
      setSuccessModal({ isOpen: true, type });

      // Tunggu 2 detik agar user melihat modal sukses, baru hapus data dari list
      setTimeout(() => {
        setSuccessModal({ isOpen: false, type: null }); // Tutup modal sukses

        // Mulai animasi hapus dari list
        setRemovingId(id_reservasi);
        setTimeout(() => {
          setReservations((prev) => prev.filter((r) => r.id_reservasi !== id_reservasi));
          setRemovingId(null);
        }, 400);
      }, 2000); // Modal sukses tampil selama 2 detik
    } catch (err) {
      console.error(`Gagal memproses aksi:`, err);
      // if (loadingToast) toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "An error occurred while processing.");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAFF] flex relative font-sans">
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          zIndex: 99999,
        }}
      />

      <Sidebar />
      <main className="flex-1 pl-72 pr-8 py-8 bg-[#F5FAFF]font-sans">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[48px] font-bold text-[#0E1315] -mt-8 mb-4">Manage Reservation</h1>

          {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#0B3C78] mr-2" />
              <p className="text-[#0B3C78] font-semibold">Loading reservation data...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl 
            shadow-sm border border-gray-200 mt-10"
            >
              <Info className="w-10 h-10 text-gray-400 mb-4" />
              <p className="text-center text-gray-500 text-lg font-medium">
                There is no reservation data at the moment.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reservations.map((item) => {
                const deadlineDate = new Date(item.deadline_date).toLocaleDateString("en-GB");
                const isPending = item.status && item.status.toLowerCase() === "pending";
                const displayStatus = formatStatus(item.status);

                return (
                  <div
                    key={item.id_reservasi}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full transition-all duration-500 border-b-4 border-b-black ${
                      removingId === item.id_reservasi
                        ? "opacity-0 translate-y-4 scale-95"
                        : "hover:shadow-md"
                    }`}
                  >
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-5">
                      {/* LEFT */}
                      <div>
                        <p className="text-[#0B3C78] font-bold text-[24px] tracking-wide uppercase">
                          Block {item.block_name} • No. {item.number_house}
                        </p>

                        <h2 className="text-[40px] font-bold text-0E1315 mt-1">
                          {item.residence_name || "Unknown Residence"}
                        </h2>
                      </div>

                      {/* RIGHT: STATUS + DATE INFO */}
                      <div className="flex flex-col items-end gap-3">
                        {/* STATUS */}
                        <span
                          className={`border rounded-full text-xs font-semibold tracking-wider capitalize
                            inline-flex items-center justify-center text-center
                            w-[96px] h-[24px] px-0 leading-none${
                            item.status?.toLowerCase() === "pending"
                              ? "border-[#C5880A] text-[#C5880A] bg-white"
                              : item.status?.toLowerCase() === "accepted"
                                ? "border-[#249A42] text-[#249A42] bg-green-50"
                                : item.status?.toLowerCase() === "expired"
                                  ? "border-orange-200 text-orange-700 bg-orange-50"
                                  : "border-red-200 text-red-700 bg-red-50"
                          }`}
                        >
                          {displayStatus}
                        </span>

                        {/* DATE CARD (RESERVATION DATE + DEADLINE) */}
                        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full">
                          <div className="grid grid-cols-[auto_1fr] gap-x-2 text-sm font-medium text-[#0E1315]">
                            {/* Reservation */}
                            <span>Reservation</span>
                            <span>
                              : {new Date(item.reservation_date).toLocaleDateString("en-GB")}
                            </span>

                            {/* Deadline */}
                            <span>Deadline</span>
                            <span>: {deadlineDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100 mb-5" />

                    {/* Body Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div className="space-y-3">
                        <div>
                          <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                            Customer Info
                          </span>
                          <p className="text-[#0E1315] text-[16px] font-normal">{item.name}</p>
                          <p className="text-[16px] text-[#0E1315]">{item.email}</p>
                        </div>
                        <div>
                          <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                            Address
                          </span>
                          <p className="text-[16px] font-normal text-[#0E1315] leading-relaxed">
                            {item.address}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 md:border-l md:pl-6 border-gray-100">
                        <div>
                          <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                            Property Details
                          </span>
                          <p className="text-[16px] text-[#0E1315] text-normal leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex gap-6 mt-8">
                          <div>
                            <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                              Land Area
                            </span>
                            <p className="text-[16px] font-normal text-[#0E1315] leading-relaxed">
                              {item.land_area} m²
                            </p>
                          </div>
                          <div>
                            <span className="block text-[16px] font-bold text-[#0B3C78] uppercase tracking-wider">
                              House Area
                            </span>
                            <p className="text-[16px] text-[#0E1315] font-normal leading-relaxed">
                              {item.building_area} m²
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Card - ACTION BUTTONS */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => openModal("cancel", item.id_reservasi, item.id_house)}
                            disabled={isActionLoading}
                            className="px-6 py-2.5 rounded-lg font-semibold text-[#B93227] border border-[#B93227] bg-transparent hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={() => openModal("accept", item.id_reservasi, item.id_house)}
                            disabled={isActionLoading}
                            className="px-6 py-2.5 rounded-lg font-semibold text-white bg-[#0F62FF] hover:opacity-90 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Accept
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full italic">
                          <CheckCircle className="w-4 h-4 mr-2 text-gray-400" />
                          Reservasi ini telah selesai diproses.
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

      {/* --- MODAL KONFIRMASI (Action Modal) --- */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          {/* ... (ISI MODAL KONFIRMASI SAMA SEPERTI SEBELUMNYA) ... */}
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-center text-[#0E1315] mb-2">
              {actionModal.type === "accept" ? "Accept Reservation" : "Cancel Reservation"}
            </h3>
            <div className="w-full h-px bg-gray-200 my-4"></div>

            <p className="text-gray-600 text-center mb-8 text-lg">
              {actionModal.type === "accept"
                ? "Are you sure you want to approve this reservation?"
                : "Are you sure you want to reject this reservation?"}
            </p>

            <div className="flex justify-evenly mx-1 mt-4">
              {actionModal.type === "accept" ? (
                <>
                  {/* Dismiss kiri */}
                  <button
                    onClick={closeModal}
                    disabled={isActionLoading}
                    className="w-36 py-3 rounded-lg font-bold text-[#0B3C78] bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center cursor-pointer"
                  >
                    Dismiss
                  </button>

                  {/* Approve kanan */}
                  <button
                    onClick={executeAction}
                    disabled={isActionLoading}
                    className="w-36 py-3 rounded-lg font-bold text-white bg-[#0F62FF] hover:opacity-90 transition flex items-center justify-center disabled:opacity-70 cursor-pointer"
                  >
                    {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accept"}
                  </button>
                </>
              ) : (
                <>
                  {/* Keep kiri */}
                  <button
                    onClick={closeModal}
                    disabled={isActionLoading}
                    className="w-36 py-3 rounded-lg font-bold text-[#0B3C78] bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center cursor-pointer"
                  >
                    Keep
                  </button>

                  {/* Reject kanan */}
                  <button
                    onClick={executeAction}
                    disabled={isActionLoading}
                    className="w-36 py-3 rounded-lg font-bold text-white bg-[#B93227] hover:bg-red-700 transition flex items-center justify-center disabled:opacity-70 cursor-pointer"
                  >
                    {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cancelled"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- NEW SUCCESS POPUP MODAL (Ala Screenshot) --- */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[30px] p-8 md:p-10 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 scale-100 animate-in zoom-in-95 duration-300">
            {/* Icon Check Biru Besar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#E6EEFF" }} // biru muda senada
            >
              <Check
                className="w-12 h-12"
                strokeWidth={3}
                style={{ color: "#0F62FF" }} // warna utama biru tegas
              />
            </div>

            {/* Teks Judul */}
            <h2 className="text-2xl font-extrabold text-[#0E1315] text-center mb-3">
              {successModal.type === "accept" ? "Reservation Accepted!" : "Reservation Canceled"}
            </h2>

            {/* Teks Deskripsi */}
            <p className="text-gray-500 text-center text-base leading-relaxed">
              {successModal.type === "accept"
                ? "The reservation has been successfully approved. Updating list..."
                : "The reservation has been successfully canceled. Updating list..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReservation;
