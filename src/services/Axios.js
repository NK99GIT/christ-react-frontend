import axios from "axios";

const Axios = axios.create({
  // baseURL: "http://localhost:5001/api/",
  baseURL: "https://api.friendsinchrist.in/api/",
  // baseURL: "http://54.252.65.137:5001/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach token if available
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
   if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default Axios;
