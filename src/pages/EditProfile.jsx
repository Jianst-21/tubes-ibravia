import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, User, Upload, X } from "lucide-react";
import apiUser from "../../api/apiUser";

export default function EditProfile() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    profile_photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Ambil user dari localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const id_user = storedUser.id_user;

  if (!id_user) {
    toast.error("User tidak valid!");
    return null;
  }

  // ======== Theme Persist =========
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
  // ================================

  // ======== Fetch Data User =========
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiUser.get(`/${id_user}`);
        console.log("Response dari /user/:id:", res);

        if (res?.data?.user) {
          const userData = res.data.user;
          const [first, ...rest] = (userData.name || "").split(" ");
          const last = rest.join(" ");

          setUser({
            first_name: first,
            last_name: last,
            email: userData.email || "",
            phone_number: userData.phone_number || "",
            address: userData.address || "",
            profile_photo: null,
          });

          setPreview(userData.photo_profile || null);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data profil.");
      }
    };
    fetchUser();
  }, [id_user]);
  // ================================

  // ======== Handle Ganti Foto =========
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB.");
        return;
      }
      setPreview(URL.createObjectURL(file));
      setUser({ ...user, profile_photo: file });
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    setUser({ ...user, profile_photo: null });
  };
  // ================================

  // ======== Submit Update Profil =========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);
      formData.append("phone_number", user.phone_number);
      formData.append("address", user.address);

      if (user.profile_photo instanceof File) {
        formData.append("profile_photo", user.profile_photo);
      } else if (user.profile_photo === null && preview === null) {
        formData.append("remove_photo", "true");
      }

      const res = await apiUser.put(`/${id_user}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profil berhasil diperbarui!");
      setPreview(res.data?.user?.photo_profile || null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };
  // ================================

  return (
    <div
      className={`min-h-screen w-full px-4 sm:px-8 py-10 flex flex-col items-center transition-colors duration-300 ${
        isDark ? "bg-background dark" : "bg-background"
      }`}
    >
      <Toaster position="top-right" />

      {/* Header */}
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

      {/* Card */}
      <div
        className={`w-full max-w-6xl border border-border p-8 md:p-12 rounded-2xl transition-colors duration-300 ${
          isDark ? "bg-card dark:bg-card" : "bg-card"
        }`}
      >
        {/* Foto & info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-48 h-48 rounded-full bg-card flex items-center justify-center overflow-hidden border border-border transition-all duration-300">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-foreground/50" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="upload-photo"
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" /> Upload Photo
              </label>
              <input
                id="upload-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />

              {preview && (
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-2 text-red-500 text-sm hover:underline transition"
                >
                  <X className="w-4 h-4" /> Remove Photo
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:block w-px h-36 bg-border"></div>

          <div className="text-sm text-foreground/70 md:ml-4">
            <h2 className="font-semibold mb-1">Image requirements:</h2>
            <ul className="list-disc pl-5 space-y-1 leading-relaxed">
              <li>Min. 400 x 400px</li>
              <li>Max. 2MB</li>
              <li>Your face or company logo</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              value={user.first_name}
              onChange={(val) => setUser({ ...user, first_name: val })}
              disabled={false}
              isDark={isDark}
            />
            <InputField
              label="Last Name"
              value={user.last_name}
              onChange={(val) => setUser({ ...user, last_name: val })}
              disabled={false}
              isDark={isDark}
            />
          </div>
          <InputField
            label="Telephone"
            value={user.phone_number}
            onChange={(val) => setUser({ ...user, phone_number: val })}
            disabled={false}
            isDark={isDark}
          />
          <InputField
            label="Email Address"
            value={user.email}
            onChange={() => {}}
            disabled
            isDark={isDark}
          />
          <TextAreaField
            label="Address"
            value={user.address}
            onChange={(val) => setUser({ ...user, address: val })}
            isDark={isDark}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`ibravia-button ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Input Components
const InputField = ({ label, value, onChange, disabled, isDark }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-foreground">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300 ${
        disabled
          ? "bg-background/50 text-foreground/50 cursor-not-allowed"
          : "bg-card text-foreground"
      }`}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, isDark }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-foreground">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-border rounded-md p-3 bg-card text-foreground resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
    />
  </div>
);
