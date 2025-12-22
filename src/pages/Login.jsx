import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../api/api";
import apiAdmin from "../api/apiadmin";
import herobg from "../assets/images/colection/hero-bg.jpg";

/**
 * Komponen Login
 * Menangani proses masuk untuk dua jenis aktor: User (via Email) dan Admin (via Username).
 * Dilengkapi dengan fitur auto-redirect, pembersihan session lama, dan integrasi Google OAuth.
 */
export const Login = () => {
  // State untuk menyimpan input kredensial dan kontrol UI
  const [identifier, setIdentifier] = useState(""); // Bisa berupa email (user) atau username (admin)
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle visibilitas password
  const [submitted, setSubmitted] = useState(false); // Status loading saat proses submit
  const navigate = useNavigate();

  /**
   * Pembersihan Jejak Admin:
   * Jika sistem mendeteksi ada data admin yang tersisa saat membuka halaman login user,
   * maka seluruh localStorage akan dibersihkan demi keamanan.
   */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (stored?.role === "admin") {
      localStorage.clear(); 
    }
  }, []);

  /**
   * Auto Redirect:
   * Jika pengguna sudah dalam status login, sistem akan otomatis mengarahkan
   * ke halaman yang sesuai berdasarkan role mereka (Admin ke Dashboard, User ke Homepage).
   */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (isLoggedIn === "true") {
      if (userData?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData?.role === "user") {
        navigate("/");
      }
    }
  }, [navigate]);

  /**
   * Handler Submit Login:
   * Mendeteksi tipe login berdasarkan karakter '@'.
   * Jika ada '@', maka dianggap User Login (memanggil userApi).
   * Jika tidak ada, maka dianggap Admin Login (memanggil apiAdmin).
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      let res, role, token, currentUser;
      const isEmail = identifier.includes("@");

      // Logika Login User (Endpoint: /auth/login)
      if (isEmail) {
        res = await userApi.post("/auth/login", { identifier, password });
        role = "user";
        token = res.data.token;
        currentUser = res.data.user;
      }

      // Logika Login Admin (Endpoint: /login)
      else {
        res = await apiAdmin.post("/login", { identifier, password });
        role = "admin";
        token = res.data.token;
        currentUser = res.data.admin;
      }

      if (!currentUser) throw new Error("User data not found.");

      // Normalisasi data untuk disimpan ke dalam session storage (localStorage)
      const userToStore = {
        id_user: currentUser.id_user || currentUser.id || currentUser.id_admin,
        name: currentUser.name || currentUser.username,
        email: currentUser.email,
        role,
      };

      // Penyimpanan kredensial ke localStorage
      localStorage.setItem("user", JSON.stringify(userToStore));
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login successful!");

      // Pengalihan halaman setelah delay 1 detik agar toast sempat terlihat
      setTimeout(() => {
        navigate(role === "admin" ? "/admin/dashboard" : "/");
      }, 1000);
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Incorrect email or password.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2 md:gap-x-[80px] bg-[hsl(var(--background))] font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* SISI KIRI: Formulir Login */}
      <div className="flex items-center justify-center px-6 md:pl-[80px] md:pr-0">
        <div className="w-full max-w-md animate-[fade-in_0.8s_ease-out_forwards] text-left">
          <h2 className="text-[56px] font-bold mb-2 text-foreground font-subheader">
            Welcome Back
          </h2>
          <p className="text-[16px] text-muted-foreground mb-8">
            Log in to access your account and explore properties.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Email atau Username */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Email / Username
              </label>
              <input
                type="text"
                placeholder="you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                className="w-full border border-border rounded-md px-4 py-2 text-sm bg-card 
                text-foreground shadow-sm outline-none transition-all duration-300 focus:ring-2 
                focus:ring-primary focus:ring-offset-2"
                required
              />
            </div>

            {/* Input Password dengan fitur toggle Intip (Show/Hide) */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pr-10 border border-border rounded-md px-4 py-2 text-sm bg-card 
                  text-foreground shadow-sm outline-none transition-all duration-300 focus:ring-2 
                  focus:ring-primary focus:ring-offset-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 
                  hover:text-gray-700 opacity-50 hover:opacity-100 transition-opacity duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Opsi Tambahan: Remember Me & Lupa Password */}
            <div className="flex items-center justify-between text-[16px] text-foreground">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4 rounded-sm" />
                Remember me
              </label>
              <a
                href="/forgot-password"
                className="text-primary hover:underline hover:opacity-90 transition"
              >
                Forgot Password?
              </a>
            </div>

            {/* Tombol Submit Login Utama */}
            <button
              type="submit"
              disabled={submitted}
              className="cursor-pointer w-full py-2 rounded-md font-medium text-primary-foreground 
              bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-600 transition-all 
              duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {submitted ? "Processing..." : "Log In"}
            </button>
          </form>

          {/* Garis Pembatas (Divider) */}
          <div className="flex items-center my-8">
            <hr className="flex-1 border-border" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or continue with</span>
            <hr className="flex-1 border-border" />
          </div>

          {/* Opsi Login Sosial: Google OAuth */}
          <button
            type="button"
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`)
            }
            className="cursor-pointer w-full border border-blue-600 text-blue-600 py-2 rounded-md 
            flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all 
            duration-200 active:scale-[0.98]"
          >
            <FcGoogle className="text-xl" /> Log in with Google
          </button>

          {/* Navigasi ke pendaftaran akun baru */}
          <p className="text-[16px] text-foreground mt-6 text-center md:text-left">
            No account yet?{" "}
            <Link to="/SignUp" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* SISI KANAN: Gambar Latar Belakang (Desktop Only) */}
      <div className="hidden md:block">
        <img src={herobg} alt="Login background" className="w-full h-full object-cover" />
      </div>
    </section>
  );
};