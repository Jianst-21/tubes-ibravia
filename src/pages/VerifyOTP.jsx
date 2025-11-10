import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

export const VerifyOTP = ({ length = 6, resendCooldown = 30 }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Ambil email & purpose dari state, fallback ke localStorage
  const [email, setEmail] = useState(location.state?.email || localStorage.getItem("email") || "");
  const [purpose, setPurpose] = useState(location.state?.purpose || localStorage.getItem("purpose") || "signup");

  // Simpan ke localStorage agar tetap tersedia setelah refresh
  useEffect(() => {
    if (email) localStorage.setItem("email", email);
    if (purpose) localStorage.setItem("purpose", purpose);
  }, [email, purpose]);

  // Redirect jika email tidak ditemukan
  useEffect(() => {
    if (!email) {
      alert("Email tidak ditemukan. Silakan ulangi proses.");
      navigate(purpose === "signup" ? "/SignUp" : "/ForgotPassword");
    }
  }, [email, navigate, purpose]);

  // Timer resend OTP
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const focusInput = (idx) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...values];
    next[idx] = val;
    setValues(next);
    if (val && idx < length - 1) focusInput(idx + 1);
    if (idx === length - 1 && next.every((v) => v)) submitCode(next.join(""));
  };

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

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length).split("");
    if (!digits.length) return;
    const next = Array(length).fill("");
    for (let i = 0; i < digits.length; i++) next[i] = digits[i];
    setValues(next);
    if (digits.length === length) submitCode(next.join(""));
  };

  const submitCode = async (code) => {
    if (!email) return alert("Email tidak ditemukan.");
    setIsVerifying(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp: code,
        purpose, // kirim purpose yang valid
      });

      alert(res.data.message);

      localStorage.removeItem("email");
      localStorage.removeItem("purpose");

      navigate(purpose === "signup" ? "/Login" : "/ResetPassword", { state: { email } });
    } catch (err) {
      console.error("❌ Verify error:", err.response?.data || err);
      setError(err.response?.data?.error || "Verifikasi gagal. Coba lagi.");
      setValues(Array(length).fill(""));
      focusInput(0);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert("Email tidak ditemukan, silakan ulangi proses.");
      navigate(purpose === "signup" ? "/SignUp" : "/ForgotPassword");
      return;
    }

    try {
      const res = await api.post("/auth/resend-otp", {
        email,
        purpose, // selalu kirim purpose yang benar
      });
      alert(res.data.message);
      setTimeLeft(resendCooldown);
      setCanResend(false);
    } catch (err) {
      console.error("❌ Resend OTP error:", err.response?.data || err);
      alert(err.response?.data?.error || "Gagal mengirim ulang OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 animate-[fade-in_0.7s_ease-out_forwards]">
      <div className="w-full max-w-md bg-card text-center rounded-2xl shadow-lg p-6 border border-border">
        <h1 className="text-2xl font-subheader mb-2 text-foreground">Insert OTP Code</h1>
        <p className="text-sm text-slate-500 mb-6">
          The OTP code has been sent to your email.
        </p>

        <form
          className="flex flex-col items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (values.every((v) => v !== "")) submitCode(values.join(""));
            else setError("Isi semua digit OTP.");
          }}
        >
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
                className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 transition shadow-sm"
                autoComplete={i === 0 ? "one-time-code" : "off"}
              />
            ))}
          </div>

          <div className="w-full mt-2">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <button type="submit" disabled={isVerifying} className="ibravia-button w-full disabled:opacity-50">
              {isVerifying ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>
          </div>

          <div className="text-center mt-4 text-sm text-slate-600">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`cursor-pointer font-medium transition-all duration-300 ${
                canResend ? "text-blue-600 hover:text-blue-700 hover:underline" : "text-slate-400 cursor-not-allowed"
              }`}
            >
              {canResend ? "Kirim ulang kode" : `Kirim ulang kode (${timeLeft}s)`}
            </button>
            {!canResend && <div className="mt-1 text-xs text-slate-500 animate-pulse">Wait until {timeLeft}s before resending</div>}
          </div>
        </form>
      </div>
    </div>
  );
};
