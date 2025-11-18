import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/api";
import PopupSignup from "../components/PopUp/PopupSignup";
import herobg from "../assets/images/colection/hero-bg.jpg";

export const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // Validasi password dan konfirmasi
  useEffect(() => {
    if (formData.password && !passwordRegex.test(formData.password)) {
      setError(prev => ({
        ...prev,
        password: "Password must include minimum 8 characters, letters, numbers, and symbols.",
      }));
    } else setError(prev => ({ ...prev, password: "" }));

    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
      setError(prev => ({ ...prev, confirm: "Passwords do not match." }));
    } else setError(prev => ({ ...prev, confirm: "" }));
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert("Please fill all required fields!");
      return;
    }

    if (error.password || error.confirm) {
      alert("Please check your input!");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const userData = { name: fullName, email: formData.email, password: formData.password };

    try {
      const res = await api.post("/auth/signup", userData);

      // simpan email & purpose ke localStorage
      localStorage.setItem("email", formData.email);
      localStorage.setItem("otpPurpose", "signup");

      // munculkan popup sukses
      setPopupMessage({
        title: "Registration Successful!",
        text: res.data.message || "The OTP has been sent to your email. Please verify your account!",
      });
      setShowPopup(true);
    } catch (err) {
      console.error("Signup error:", err);
      setPopupMessage({
        title: "Failed to Register",
        text: err.response?.data?.error || "An error occurred during registration.",
      });
      setShowPopup(true);
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2 md:gap-x-[80px] bg-[hsl(var(--background))] font-sans">
      <div className="flex items-center justify-center px-6 md:pl-[80px] md:pr-0">
        <div className="w-full max-w-md animate-[fade-in_0.8s_ease-out_forwards] text-left">
          <h2 className="text-4xl font-bold mb-2 text-black font-[var(--font-subheader)]">
            Create Account
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Sign up to get started with your new account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-border rounded-md px-4 py-2 text-sm bg-card text-foreground shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-border rounded-md px-4 py-2 text-sm bg-card text-foreground shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full border border-border rounded-md px-4 py-2 text-sm bg-card text-foreground shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pr-10 border rounded-md px-4 py-2 text-sm bg-card text-foreground shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${error.password ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 opacity-50 hover:opacity-100 transition-opacity duration-200 bg-transparent border-none p-0 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error.password && (
                <p className="text-xs text-red-500 mt-2 animate-[fade-in_0.3s_ease-out]">{error.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-foreground">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pr-10 border rounded-md px-4 py-2 text-sm 
                    bg-card text-foreground shadow-sm outline-none transition-all duration-300 
                    focus:ring-2 focus:ring-offset-2 ${error.confirm ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center 
                  text-gray-500 hover:text-gray-700 opacity-50 hover:opacity-100 
                  transition-opacity duration-200 bg-transparent border-none p-0 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error.confirm && (
                <p className="text-xs text-red-500 mt-2 animate-[fade-in_0.3s_ease-out]">{error.confirm}</p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-primary text-white py-2 rounded-md hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <hr className="flex-1 border-border" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
              or continue with
            </span>
            <hr className="flex-1 border-border" />
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`)
            }
            className="cursor-pointer w-full border border-blue-600 text-blue-600 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-[0.98]"
          >
            <FcGoogle className="text-xl" /> Log in with Google
          </button>

          <p className="text-sm text-foreground mt-6 text-center md:text-left">
            Have an account?{" "}
            <Link to="/Login" className="text-primary hover:underline">
              Login
            </Link>
          </p>

          <PopupSignup
            show={showPopup}
            message={popupMessage}
            onClose={() => {
              setShowPopup(false);
              navigate("/VerifyOTP", { state: { email: formData.email, purpose: "signup" } });
            }}
          />
        </div>

      </div>

      <div className="hidden md:block">
        <img src={herobg} alt="Sign up background" className="w-full h-full object-cover" />
      </div>
    </section>
  );
};
