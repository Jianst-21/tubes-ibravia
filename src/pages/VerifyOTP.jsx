import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

/**
 * Komponen VerifyOTP
 * Berfungsi untuk memverifikasi kode OTP yang dikirim ke email pengguna.
 * Digunakan untuk dua tujuan utama: pendaftaran akun (signup) dan reset password.
 */
export const VerifyOTP = ({ length = 6, resendCooldown = 30 }) => {
  // 1. STATE MANAGEMENT
  const [values, setValues] = useState(Array(length).fill("")); // Array untuk menampung tiap digit OTP
  const [isVerifying, setIsVerifying] = useState(false);        // Status loading saat verifikasi ke server
  const [error, setError] = useState("");                       // Menyimpan pesan kesalahan
  const [timeLeft, setTimeLeft] = useState(resendCooldown);     // Sisa waktu untuk kirim ulang (countdown)
  const [canResend, setCanResend] = useState(false);           // Status apakah tombol resend aktif
  const inputsRef = useRef([]);                                 // Referensi DOM untuk kontrol fokus input

  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil data email dan tujuan (purpose) dari state router atau memori lokal
  const [email] = useState(location.state?.email || localStorage.getItem("email") || "");
  const [purpose] = useState(
    location.state?.purpose || localStorage.getItem("otpPurpose") || "signup"
  );

  /**
   * 2. PERSISTENCE EFFECT:
   * Menyimpan email dan purpose ke localStorage agar data tidak hilang saat halaman di-refresh.
   */
  useEffect(() => {
    if (email) localStorage.setItem("email", email);
    if (purpose) localStorage.setItem("otpPurpose", purpose);
  }, [email, purpose]);

  /**
   * 3. PROTECTION EFFECT:
   * Mengalihkan pengguna kembali ke halaman awal jika data email tidak ditemukan.
   */
  useEffect(() => {
    if (!email) {
      alert("Email not found. Please restart the process.");
      navigate(purpose === "signup" ? "/SignUp" : "/ForgotPassword");
    }
  }, [email, navigate, purpose]);

  /**
   * 4. TIMER EFFECT:
   * Menjalankan hitung mundur (countdown) untuk fitur Kirim Ulang Kode.
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Fungsi pembantu untuk memindahkan fokus kursor ke kotak input tertentu
  const focusInput = (idx) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  /**
   * 5. INPUT HANDLERS:
   * Mengelola perpindahan fokus otomatis saat pengguna mengetik digit.
   */
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...values];
    next[idx] = val;
    setValues(next);

    // Pindah ke kotak selanjutnya jika kotak saat ini sudah terisi
    if (val && idx < length - 1) focusInput(idx + 1);
    
    // Otomatis submit jika semua kotak sudah terisi
    if (idx === length - 1 && next.every((v) => v)) submitCode(next.join(""));
  };

  /**
   * 6. KEYDOWN HANDLER:
   * Mengelola penghapusan karakter menggunakan Backspace dan memundurkan fokus kursor.
   */
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[idx]) {
        next[idx] = "";
        setValues(next);
      } else if (idx > 0) {
        next[idx - 1] = "";
        setValues(next);
        focusInput(idx - 1);
      }
    }
  };

  /**
   * 7. PASTE HANDLER:
   * Memungkinkan pengguna menempelkan (paste) kode OTP lengkap sekaligus ke dalam kotak input.
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length).split("");
    if (!digits.length) return;
    const next = Array(length).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setValues(next);
    if (digits.length === length) submitCode(next.join(""));
  };

  /**
   * 8. VERIFY API CALL:
   * Mengirim kode OTP ke server untuk divalidasi.
   */
  const submitCode = async (code) => {
    if (!email) return alert("Email not found.");
    setIsVerifying(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp: code,
        purpose,
      });

      alert(res.data.message);

      // Membersihkan memori sementara setelah verifikasi berhasil
      localStorage.removeItem("email");
      localStorage.removeItem("otpPurpose");

      // Navigasi ke rute tujuan berdasarkan konteks (Login atau Reset Password)
      navigate(purpose === "signup" ? "/Login" : "/ResetPassword", {
        state: { email },
      });
    } catch (err) {
      console.error(" Verify error:", err.response?.data || err);
      setError(err.response?.data?.error || "Verification failed. Please try again.");
      setValues(Array(length).fill("")); // Reset input jika gagal
      focusInput(0);
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * 9. RESEND API CALL:
   * Meminta server mengirim ulang kode OTP baru ke email pengguna.
   */
  const handleResend = async () => {
    if (!email) {
      alert("Email not found, please restart the process.");
      navigate(purpose === "signup" ? "/SignUp" : "/ForgotPassword");
      return;
    }

    try {
      const res = await api.post("/auth/resend-otp", {
        email,
        purpose,
      });

      alert(res.data.message);
      setTimeLeft(resendCooldown); // Reset timer countdown
      setCanResend(false);
    } catch (err) {
      console.error(" Resend OTP error:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 animate-[fade-in_0.7s_ease-out_forwards]">
      <div className="w-full max-w-md bg-card text-center rounded-2xl shadow-lg p-6 border border-border">
        <h1 className="text-2xl font-subheader mb-2 text-foreground">Insert OTP Code</h1>
        <p className="text-sm text-slate-500 mb-6">The OTP code has been sent to your email.</p>

        <form
          className="flex flex-col items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (values.every((v) => v !== "")) submitCode(values.join(""));
            else setError("Isi semua digit OTP.");
          }}
        >
          {/* OTP INPUT GRID */}
          <div className="flex gap-3" onPaste={handlePaste}>
            {values.map((v, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={v}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl rounded-lg border
                 border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 
                 transition shadow-sm"
                autoComplete={i === 0 ? "one-time-code" : "off"}
              />
            ))}
          </div>

          {/* ACTION BUTTONS & FEEDBACK */}
          <div className="w-full mt-2">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <button
              type="submit"
              disabled={isVerifying}
              className="ibravia-button w-full disabled:opacity-50"
            >
              {isVerifying ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>
          </div>

          {/* RESEND SECTION */}
          <div className="text-center mt-4 text-sm text-slate-600">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`cursor-pointer font-medium transition-all duration-300 ${
                canResend
                  ? "text-blue-600 hover:text-blue-700 hover:underline"
                  : "text-slate-400 cursor-not-allowed"
              }`}
            >
              {canResend ? "Kirim ulang kode" : `Kirim ulang kode (${timeLeft}s)`}
            </button>
            {!canResend && (
              <div className="mt-1 text-xs text-slate-500 animate-pulse">
                Wait until {timeLeft}s before resending
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};