import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import PopupResetPassword from "../components/PopUp/PopupResetPassword";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setPopupMessage({ title: "Email Kosong", text: "Silakan masukkan email Anda." });
      setShowPopup(true);
      return;
    }

    try {
      const res = await api.post("/auth/forgot-password", { email });

      localStorage.setItem("email", email);
      localStorage.setItem("otpPurpose", "reset_password");

      setPopupMessage({
        title: "OTP Terkirim",
        text:
          res.data.message ||
          "Kode OTP telah dikirim ke email Anda. Silakan cek email dan verifikasi akun.",
      });
      setShowPopup(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      setPopupMessage({
        title: "Gagal Mengirim OTP",
        text: err.response?.data?.error || "Terjadi kesalahan saat mengirim OTP.",
      });
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 space-y-0"
      >
        <h2 className="text-2xl font-bold text-center text-[#1e1e1e]">
          Forgotten your password?
        </h2>
        <p className="text-center text-[14px] text-gray-600 mt-3">
          There is nothing to worry about, we'll send you a message to help you reset your password.
        </p>

       
        <div className="mt-[45px]">
          <label className="block text-sm font-medium text-gray-800 mb-[5px]">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter personal or work email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-[#0056FF] text-white p-3 rounded-[4px] font-medium mt-6 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Send Reset OTP
        </button>
      </form>

      <PopupResetPassword
        show={showPopup}
        message={popupMessage}
        onClose={() => {
          setShowPopup(false);
          if (popupMessage?.title === "OTP Terkirim") {
            navigate("/VerifyOTP", { state: { email, purpose: "reset_password" } });
          }
        }}
      />
    </div>
  );
};
