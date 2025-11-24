// frontend/src/axiosInstance.jsx
import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< Updated upstream
  baseURL: "http://localhost:5000/",
=======
  baseURL: "http://localhost:5001",
  withCredentials: true,
>>>>>>> Stashed changes
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ถ้าไม่ใช่ FormData ให้ใช้ application/json
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // ถ้าเป็น FormData ห้ามตั้ง content-type เอง
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
