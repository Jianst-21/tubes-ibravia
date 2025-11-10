import axios from "axios";

const api = axios.create({
  baseURL: "https://server-ibravia.railway.app/api/", // backend online kamu
  withCredentials: true, // kalau pakai session / cookie
});

export default api;