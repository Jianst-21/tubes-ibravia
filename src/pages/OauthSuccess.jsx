import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react"; // Ikon Loader2 akan kita pakai

export default function OauthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const email = params.get("email");
    const name = params.get("name");
    const id = params.get("id");
    const token = params.get("token");

    // Jika data Google VALID → login sukses
    if (email && token) {
      const user = {
        id_user: id,
        name,
        email,
        role: "user",
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
      return;
    }

    // Jika gagal → tampilkan error
    toast.error("Google login failed. Please try again.");

    setTimeout(() => {
      navigate("/Login");
    }, 1000);
  }, [navigate]);

  // Bagian return yang diperbagus secara visual
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center p-4">
      {/* Menggunakan ikon spinner yang lebih modern dari lucide-react */}
      <Loader2 className="w-12 h-12 text-primary animate-spin" />

      {/* Mengelompokkan teks untuk kerapian */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xl font-semibold text-foreground">Logging in with Google...</p>
        <p className="text-base text-muted-foreground">Please wait, redirecting...</p>
      </div>
    </div>
  );
}
