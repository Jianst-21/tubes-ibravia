import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import api from "../api/api";

/**
 * Komponen EditProfile
 * Berfungsi untuk mengelola dan memperbarui data profil pribadi pengguna.
 * Mendukung fitur sinkronisasi tema (Dark/Light) dan pengambilan data profil secara otomatis.
 */
export default function EditProfile() {
  // State untuk menampung data formulir profil pengguna
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [loading, setLoading] = useState(false); // Melacak status pengiriman data ke server
  const [isDark, setIsDark] = useState(false);  // Melacak status tema saat ini

  // Mengambil ID user dari localStorage untuk validasi dan request API
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const id_user = storedUser.id_user;

  // Proteksi awal: Jika ID user tidak ada, tampilkan error dan hentikan render
  if (!id_user) {
    toast.error("User tidak valid!");
    return null;
  }

  /**
   * Effect Sinkronisasi Tema:
   * Mengatur agar tampilan halaman sesuai dengan tema (Dark/Light) yang tersimpan di sistem.
   * Menggunakan MutationObserver untuk mendeteksi perubahan tema secara realtime dari komponen lain.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const darkMode = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);

    const observer = new MutationObserver(() => {
      const isNowDark = document.documentElement.classList.contains("dark");
      setIsDark(isNowDark);
      localStorage.setItem("theme", isNowDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  /**
   * Effect Pengambilan Data:
   * Mengambil data profil user dari backend saat komponen pertama kali dimuat.
   * Memecah string 'name' dari database menjadi nama depan dan belakang untuk form.
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id_user}`);
        const data = res.data;

        if (data?.user) {
          const [first, ...rest] = (data.user.name || "").split(" ");
          const last = rest.join(" ");
          setUser({
            first_name: first,
            last_name: last,
            email: data.user.email || "",
            phone_number: data.user.phone_number || "",
            address: data.user.address || "",
          });
        }
      } catch (error) {
        toast.error("Gagal memuat data profil.");
      }
    };
    fetchUser();
  }, [id_user]);

  /**
   * Fungsi handleSubmit:
   * Mengirimkan data profil yang telah diubah ke server menggunakan method PUT.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/user/${id_user}`, user);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full px-4 sm:px-8 py-10 flex flex-col items-center 
    transition-colors duration-300 ${isDark ? "bg-background dark" : "bg-background"}`}
    >
      <Toaster position="top-right" />

      {/* Header Halaman: Berisi Judul dan Tombol Navigasi Kembali */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Edit Profile</h1>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Kartu Formulir: Kontainer utama untuk input data profil */}
      <div
        className={`w-full max-w-6xl border border-border p-8 md:p-12 rounded-2xl 
        transition-colors duration-300 ${isDark ? "bg-card dark:bg-card" : "bg-card"}`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              value={user.first_name}
              onChange={(val) => setUser({ ...user, first_name: val })}
              disabled={false}
            />
            <InputField
              label="Last Name"
              value={user.last_name}
              onChange={(val) => setUser({ ...user, last_name: val })}
              disabled={false}
            />
          </div>
          <InputField
            label="Telephone"
            value={user.phone_number}
            onChange={(val) => setUser({ ...user, phone_number: val })}
          />
          {/* Email dinonaktifkan (disabled) karena merupakan identifier unik yang tidak boleh diubah sembarangan */}
          <InputField label="Email Address" value={user.email} onChange={() => {}} disabled />
          <TextAreaField
            label="Address"
            value={user.address}
            onChange={(val) => setUser({ ...user, address: val })}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`ibravia-button ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Komponen InputField:
 * Abstraksi untuk elemen input teks agar kode lebih modular dan bersih.
 */
const InputField = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-foreground">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition ${
        disabled ? "bg-background/50 text-foreground/50" : "bg-card text-foreground"
      }`}
    />
  </div>
);

/**
 * Komponen TextAreaField:
 * Abstraksi untuk elemen textarea (digunakan pada kolom alamat).
 */
const TextAreaField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-foreground">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-border rounded-md p-3 bg-card 
      text-foreground resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary transition"
    />
  </div>
);