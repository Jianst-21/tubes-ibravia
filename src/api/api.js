import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ganti kalau port beda
  withCredentials: true, // kalau pakai session/cookie
});

export default api;