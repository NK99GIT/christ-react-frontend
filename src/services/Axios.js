import axios from "axios";

const Axios = axios.create({
  // baseURL: "http://localhost:5001/api/",
  baseURL: "http://3.107.89.15:5001/api/",
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
