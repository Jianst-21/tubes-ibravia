import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PopupResetPassword from "../components/PopUp/PopupResetPassword";

/**
 * Komponen ForgotPassword
 * Berfungsi untuk menangani permintaan reset kata sandi pengguna.
 * Proses ini melibatkan pengiriman email untuk mendapatkan kode OTP verifikasi.
 */
export const ForgotPassword = () => {
  // 1. STATE MANAGEMENT
  const [email, setEmail] = useState(""); // Menyimpan input email dari pengguna
  const [showPopup, setShowPopup] = useState(false); // Mengatur tampilan popup (muncul/sembunyi)
  const [popupMessage, setPopupMessage] = useState(null); // Menyimpan pesan judul dan teks untuk popup
  const navigate = useNavigate();

  /**
   * 2. FUNGSI handleSubmit
   * Menangani proses submit form, validasi email, dan pemanggilan API backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Cek apakah input email kosong
    if (!email) {
      setPopupMessage({ title: "Empty Email", text: "Please enter your email address." });
      setShowPopup(true);
      return;
    }

    try {
      // Mengirim permintaan OTP reset password ke server
      const res = await api.post("/auth/forgot-password", { email });

      // Menyimpan data email dan tujuan OTP ke localStorage untuk tahap verifikasi berikutnya
      localStorage.setItem("email", email);
      localStorage.setItem("otpPurpose", "reset_password");

      // Menyiapkan pesan sukses untuk ditampilkan di popup
      setPopupMessage({
        title: "OTP Sent",
        text:
          res.data.message ||
          "The OTP code has been sent to your email. Please check your inbox and verify your account.",
      });
      setShowPopup(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      // Menyiapkan pesan error jika API gagal merespon dengan sukses
      setPopupMessage({
        title: "Failed to Send OTP",
        text: err.response?.data?.error || "An error occurred while sending the OTP.",
      });
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* 3. TAMPILAN FORM FORGOT PASSWORD */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 space-y-0"
      >
        <h2 className="text-2xl font-bold text-center text-[#1e1e1e]">Forgotten your password?</h2>
        <p className="text-center text-[14px] text-gray-600 mt-3">
          There is nothing to worry about, we'll send you a message to help you reset your password.
        </p>

        {/* Input Email Address */}
        <div className="mt-[45px]">
          <label className="block text-sm font-medium text-gray-800 mb-[5px]">Email Address</label>
          <input
            type="email"
            placeholder="Enter personal or work email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tombol Submit Pengiriman OTP */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-[#0056FF] text-white p-3 rounded-[4px] 
            font-medium mt-6 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Send Reset OTP
        </button>
      </form>

      {/* 4. MODAL POPUP RESET PASSWORD
          Menangani feedback kepada user dan logika navigasi setelah popup ditutup.
      */}
      <PopupResetPassword
        show={showPopup}
        message={popupMessage}
        onClose={() => {
          setShowPopup(false);
          // Jika statusnya sukses (OTP Terkirim), arahkan pengguna ke halaman verifikasi OTP
          if (popupMessage?.title === "OTP Sent") {
            navigate("/VerifyOTP", { state: { email, otppurpose: "reset_password" } });
          }
        }}
      />
    </div>
  );
};