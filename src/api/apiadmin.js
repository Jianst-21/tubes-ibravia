import axios from "axios";

const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/admin`
    : "https://server-ibravia.up.railway.app/api/admin",
  timeout: 10000,
});

// === Interceptor Request ===
apiAdmin.interceptors.request.use(
  (config) => {
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

// === Interceptor Response ===
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
