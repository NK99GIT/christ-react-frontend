import axios from "axios";

const Axios = axios.create({
  baseURL: "http://ec2-3-104-124-106.ap-southeast-2.compute.amazonaws.com:3306/api/", // ✅ update to your backend URL
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
