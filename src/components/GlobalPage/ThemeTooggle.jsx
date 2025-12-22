import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Komponen ThemeToggle
 * Berfungsi untuk mengganti tema aplikasi antara mode gelap (Dark Mode) dan mode terang (Light Mode).
 * Pengaturan tema disimpan di LocalStorage agar tetap bertahan saat halaman di-refresh.
 */
export const ThemeToggle = () => {
  // State untuk melacak apakah mode gelap sedang aktif atau tidak
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Effect Inisialisasi:
   * Dijalankan sekali saat komponen pertama kali dimuat.
   * Mengambil preferensi tema yang tersimpan di LocalStorage dan menerapkannya ke elemen root (HTML).
   */
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      // Default ke mode terang jika tidak ada data atau bernilai 'light'
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    }
  }, []);

  /**
   * Fungsi toggleTheme:
   * Mengubah status tema saat tombol diklik.
   * Melakukan tiga hal: Update state UI, manipulasi class pada DOM root, dan simpan ke LocalStorage.
   */
  const toggleTheme = () => {
    if (isDarkMode) {
      // Proses berpindah ke Light Mode
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Proses berpindah ke Dark Mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "cursor-pointer p-2 rounded-full transition-colors duration-300 focus:outline-none"
      )}
    >
      {/* Render Ikon secara Kondisional: 
        Menampilkan Matahari (Sun) saat mode gelap agar user bisa beralih ke terang,
        dan menampilkan Bulan (Moon) saat mode terang agar user bisa beralih ke gelap.
      */}
      {isDarkMode ? (
        <Sun className="h-6 w-6 text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-blue-900" />
      )}
    </button>
  );
};