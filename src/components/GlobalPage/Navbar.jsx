import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Menu, X, LogOut, UserCog } from "lucide-react";
import { ThemeToggle } from "./ThemeTooggle";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LogoBiru from "../../assets/images/logo/Logo Biru.png";
import LogoPutih from "../../assets/images/logo/Logo Putih.png";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/Properties" },
  { name: "Reservation", href: "/Reservation" },
  { name: "About Us", href: "/AboutUs" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* ============================
        Click Outside Dropdown
  ============================ */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ============================
        Main Init: theme, scroll,
        login, userData
  ============================ */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Theme setup
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true });

    // Login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    // User Data
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // 🔥 FILTER: If admin → treat as loggedOut for user navbar
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

    setIsReady(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  /* ============================
        Lock Scroll on Mobile
  ============================ */
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

  /* ============================
              LOGOUT
  ============================ */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    toast.success("Logout successful!");
    navigate("/Login");
  };

  /* ============================
           AVATAR INITIAL FIX
  ============================ */
  const getAvatarLetter = () => {
    if (!userData) return ""; // 🔥 Fix U muncul
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

        {/* LOGO */}
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

        {/* DESKTOP NAV */}
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

        {/* AUTH + THEME */}
        <div className="hidden md:flex items-center gap-4">
          {isReady &&
            (isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* AVATAR BUTTON */}
                <button
                  type="button"
                  className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-r 
                  from-blue-700 to-primary text-white font-semibold flex items-center justify-center"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {getAvatarLetter()}
                </button>

                {/* DROPDOWN */}
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

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground z-[101]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden overflow-y-auto"
        >
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

          {/* MOBILE AUTH BUTTONS */}
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
