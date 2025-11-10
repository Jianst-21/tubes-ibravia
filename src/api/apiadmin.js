// src/api/apiadmin.js
import axios from "axios";

// Base URL diambil dari .env (Vite) atau fallback ke localhost
const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/admin`
    : "https://server-ibravia.up.railway.app/api/",
  timeout: 10000, //  Timeout agar request tidak menggantung
});

// Interceptor request → otomatis kirim JWT token admin
apiAdmin.interceptors.request.use(
  (config) => {
    // Ambil token admin, fallback ke token biasa (kalau login biasa)
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(" Tidak ditemukan token admin. Akses mungkin ditolak.");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response → auto-logout kalau token invalid / expired
apiAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn(" Token admin kadaluarsa atau tidak valid. Harap login ulang.");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
       
    }

    return Promise.reject(error);
  }
);

export default apiAdmin;
