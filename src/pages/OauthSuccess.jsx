import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

/**
 * Komponen OauthSuccess
 * Halaman perantara (callback) yang menangani data setelah pengguna berhasil login lewat Google.
 * Berfungsi mengekstrak data dari URL, menyimpannya ke storage, dan mengarahkan pengguna ke homepage.
 */
export default function OauthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. EKSTRAKSI PARAMETER: Mengambil data yang dikirim oleh Backend melalui Query String di URL
    const params = new URLSearchParams(window.location.search);

    const email = params.get("email");
    const name = params.get("name");
    const id = params.get("id");
    const token = params.get("token");

    /**
     * 2. VALIDASI & SESSION STORAGE: 
     * Jika data esensial (email & token) tersedia, maka proses login dianggap sah.
     */
    if (email && token) {
      const user = {
        id_user: id,
        name,
        email,
        role: "user", // Default role untuk login Google di Ibravia
      };

      // Menyimpan data sesi ke LocalStorage agar user tetap login meskipun halaman di-refresh
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login successful!");
      
      // Delay singkat untuk memberi waktu toast muncul sebelum pindah halaman
      setTimeout(() => {
        navigate("/");
      }, 1000);
      return;
    }

    /**
     * 3. HANDLING ERROR: 
     * Jika parameter tidak lengkap, maka proses OAuth dianggap gagal.
     */
    toast.error("Google login failed. Please try again.");

    setTimeout(() => {
      navigate("/Login");
    }, 1000);
  }, [navigate]);

  return (
    /**
     * Tampilan Loading State: 
     * Memberikan indikasi visual (spinner) saat sistem sedang memproses penyimpanan token.
     */
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center p-4">
      {/* Animasi spinner modern menggunakan Lucide-React */}
      <Loader2 className="w-12 h-12 text-primary animate-spin" />

      <div className="flex flex-col gap-1.5">
        <p className="text-xl font-semibold text-foreground">Logging in with Google...</p>
        <p className="text-base text-muted-foreground">Please wait, redirecting...</p>
      </div>
    </div>
  );
}