import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/api";
import PopupResetPasswordSuccess from "../components/PopUp/PopupResetPasswordSuccess";

/**
 * Komponen ResetPassword
 * Halaman akhir dari alur lupa kata sandi di mana pengguna memasukkan password baru.
 * Memeriksa kekuatan password secara real-time dan mencocokkan konfirmasi password.
 */
export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil email dari state router atau localStorage sebagai identitas akun yang akan di-reset
  const email = location.state?.email || localStorage.getItem("email");

  // State untuk input, error, dan visibilitas password
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  /**
   * REGEX PASSWORD:
   * Mengharuskan minimal 8 karakter, terdapat huruf, angka, dan simbol khusus.
   */
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  /**
   * VALIDASI REAL-TIME:
   * Berjalan setiap kali nilai 'password' atau 'confirm' berubah.
   * Memberikan feedback instan kepada pengguna tanpa harus menekan tombol submit.
   */
  useEffect(() => {
    // Validasi kompleksitas password
    if (password && !passwordRegex.test(password)) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters, include letters, numbers, and symbols.",
      }));
    } else {
      setError((prev) => ({ ...prev, password: "" }));
    }

    // Validasi kecocokan password dengan konfirmasi
    if (confirm && confirm !== password) {
      setError((prev) => ({
        ...prev,
        confirm: "Passwords do not match.",
      }));
    } else {
      setError((prev) => ({ ...prev, confirm: "" }));
    }
  }, [password, confirm]);

  /**
   * HANDLER SUBMIT:
   * Memvalidasi ulang data sebelum dikirim ke server melalui API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek keberadaan email context
    if (!email) {
      setPopupMessage({
        title: "Email Not Found",
        text: "Please restart the password reset process.",
      });
      setShowPopup(true);
      return;
    }

    // Cek apakah field kosong
    if (!password || !confirm) {
      setError({
        password: !password ? "Please enter your new password." : "",
        confirm: !confirm ? "Please confirm your password." : "",
      });
      return;
    }

    // Mencegah request jika masih ada pesan error validasi
    if (error.password || error.confirm) return;

    try {
      // Mengirimkan password baru ke backend Ibravia
      await api.post("/auth/reset-password", { email, newPassword: password });

      setPopupMessage({
        title: "Password Reset Successful",
        text: "Your password has been successfully updated. Please login again.",
      });
      setShowPopup(true);
    } catch (err) {
      console.error("Reset password error:", err);
      setPopupMessage({
        title: "Failed to Reset Password",
        text: err.response?.data?.error || "An error occurred while resetting your password.",
      });
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg flex flex-col justify-center items-stretch"
        style={{
          width: "680px",
          height: "550px",
          padding: "60px",
        }}
      >
        <h2 className="text-3xl font-bold text-center text-[#1e1e1e]">Reset your password</h2>
        <p className="text-center text-gray-600 mt-3 leading-relaxed">
          Enter your new password below and confirm it to reset your account access.
        </p>

        {/* INPUT PASSWORD BARU */}
        <div className="mt-[45px]">
          <label className="block text-sm font-medium text-gray-800 mb-[4px]">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pr-10 border rounded-md p-3 text-sm focus:ring-2 focus:ring-offset-2 
                outline-none transition-all duration-300 ${
                  error.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              required
            />
            {/* Toggle untuk melihat/menyembunyikan password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 
              hover:text-gray-700 opacity-50 hover:opacity-100 bg-transparent border-none p-0 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* Pesan Error Password */}
          {error.password && (
            <p className="text-xs text-red-500 mt-2 animate-[fade-in_0.3s_ease-out]">
              {error.password}
            </p>
          )}
        </div>

        {/* INPUT KONFIRMASI PASSWORD */}
        <div className="mt-[14px]">
          <label className="block text-sm font-medium text-gray-800 mb-[4px]">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full pr-10 border rounded-md p-3 text-sm focus:ring-2 
                focus:ring-offset-2 outline-none transition-all duration-300 ${
                  error.confirm
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 
              hover:text-gray-700 opacity-50 hover:opacity-100 bg-transparent border-none p-0 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* Pesan Error Konfirmasi */}
          {error.confirm && (
            <p className="text-xs text-red-500 mt-2 animate-[fade-in_0.3s_ease-out]">
              {error.confirm}
            </p>
          )}
        </div>

        {/* TOMBOL SUBMIT */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-[#0056FF] text-white p-3 rounded-md font-medium mt-6 
          hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Reset Password
        </button>
      </form>

      {/* POPUP SUKSES/GAGAL:
          Jika reset berhasil, data email di localStorage dihapus demi keamanan dan diarahkan ke Login.
      */}
      <PopupResetPasswordSuccess
        show={showPopup}
        message={popupMessage}
        onClose={() => {
          setShowPopup(false);
          if (popupMessage?.title === "Password Reset Successful") {
            localStorage.removeItem("email");
            navigate("/Login");
          }
        }}
      />
    </div>
  );
};