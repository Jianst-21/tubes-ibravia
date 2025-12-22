import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Menu, X, LogOut, UserCog } from "lucide-react";
import { ThemeToggle } from "./ThemeTooggle";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LogoBiru from "../../assets/images/logo/Logo Biru.png";
import LogoPutih from "../../assets/images/logo/Logo Putih.png";

/**
 * Konfigurasi menu navigasi utama.
 */
const navItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/Properties" },
  { name: "Reservation", href: "/Reservation" },
  { name: "About Us", href: "/AboutUs" },
];

/**
 * Komponen Navbar Utama.
 * Mengelola navigasi, tema (dark/light), status login pengguna, dan tampilan responsif.
 */
export const Navbar = () => {
  // 1. STATE MANAGEMENT
  const [isScrolled, setIsScrolled] = useState(false); // Melacak apakah layar sudah di-scroll
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Kontrol buka/tutup menu mobile
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Status autentikasi user
  const [userData, setUserData] = useState(null);      // Menyimpan data profil user
  const [isDark, setIsDark] = useState(false);         // Status tema (gelap/terang)
  const [isReady, setIsReady] = useState(false);       // Memastikan data local ter-load sebelum render auth
  const [open, setOpen] = useState(false);             // Kontrol dropdown user menu
  const dropdownRef = useRef(null);                    // Referensi DOM untuk area dropdown
  const navigate = useNavigate();

  /* 
        EFFECT: Menutup dropdown jika user klik di luar area menu
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 
        EFFECT UTAMA: Inisialisasi scroll, tema, dan status login
   */
  useEffect(() => {
    // A. Scroll Listener: Mengubah style navbar saat user scroll ke bawah
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // B. Theme Setup: Mendeteksi tema dari localStorage atau preferensi sistem
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    // C. Theme Observer: Memantau perubahan class 'dark' pada elemen HTML
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true });

    // D. Login State & User Data: Mengambil data user dari localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // Filter Keamanan: Jika role admin masuk ke UI user, paksa logout secara visual
        if (parsed.role === "admin") {
          setUserData(null);
          setIsLoggedIn(false);
        } else {
          setUserData(parsed);
        }
      } catch {
        setUserData(null);
      }
    }

    setIsReady(true); // Tandai bahwa inisialisasi selesai

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  /* 
        EFFECT: Mengunci scroll layar saat menu mobile terbuka
   */
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isMenuOpen]);

  /* 
        FUNGSI: Logout (Hapus data session & kembali ke login)
   */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    toast.success("Logout successful!");
    navigate("/Login");
  };

  /* 
        FUNGSI: Membuat inisial nama untuk avatar user */
  const getAvatarLetter = () => {
    if (!userData) return ""; 
    const nameLetter = userData.name?.trim()?.charAt(0)?.toUpperCase();
    const emailLetter = userData.email?.trim()?.charAt(0)?.toUpperCase();
    return nameLetter || emailLetter || "";
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-colors duration-300",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-sm" : "py-5"
      )}
    >
      <div className="w-full px-16 flex items-center justify-between">
        
        {/* BAGIAN 1: LOGO & BRANDING */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            key={isDark ? "logo-dark" : "logo-light"}
            src={isDark ? LogoPutih : LogoBiru}
            alt="Ibravia Logo"
            className="h-10 w-10 transition-all duration-300 object-contain pb-[6px] scale-110"
          />
          <span className={`font-bold text-[24px] ${isDark ? "text-white" : "text-[#0A3764]"} `}>
            IBRAVIA
          </span>
        </Link>

        {/* BAGIAN 2: NAVIGASI DESKTOP */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="text-foreground/80 font-bold hover:text-primary transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* BAGIAN 3: AUTHENTICATION + THEME TOGGLE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          {isReady &&
            (isLoggedIn ? (
              /* Tampilan Jika Sudah Login */
              <div className="relative" ref={dropdownRef}>
                {/* Tombol Avatar (Membuka Dropdown) */}
                <button
                  type="button"
                  className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-r 
                  from-blue-700 to-primary text-white font-semibold flex items-center justify-center"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {getAvatarLetter()}
                </button>

                {/* Dropdown Menu User */}
                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-card text-foreground shadow-lg rounded-md z-50 transition-all duration-200">
                    <p className="px-4 py-2 text-sm border-b border-border truncate">
                      {userData?.email}
                    </p>
                    <button
                      onClick={() => {
                        navigate("/EditProfile");
                        setOpen(false);
                      }}
                      className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2"
                    >
                      <UserCog size={16} /> Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2 border-t border-border"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Tampilan Jika Belum Login */
              <>
                <Link
                  to="/Login"
                  className="px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/SignUp"
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ))}
          <ThemeToggle />
        </div>

        {/* BAGIAN 4: TOMBOL MENU MOBILE (HAMBURGER) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground z-[101]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* BAGIAN 5: OVERLAY MENU MOBILE (Muncul saat Klik Hamburger) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[99] flex flex-col items-center bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden overflow-y-auto">
          {/* List Navigasi Mobile */}
          <ul className="flex flex-col items-center space-y-6 text-lg font-medium mt-24">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="w-32 border-t border-border my-8" />

          {/* Tombol Auth Mobile */}
          <div className="flex flex-col gap-4 w-[200px] mb-12">
            {isReady &&
              (isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/EditProfile");
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-5 py-2 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-5 py-2 rounded-lg font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/Login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-5 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition-all text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/SignUp"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-5 py-2 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-white transition-all text-center"
                  >
                    Sign Up
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};