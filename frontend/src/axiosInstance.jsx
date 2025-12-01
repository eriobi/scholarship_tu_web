import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5100",
  withCredentials: true,
  headers: {
    /* backend จะ parse JSON request เท่านั้น*/
    "Content-Type": "application/json",
  },
});

/* ใส่ token ก่อน req ผ่าน interceptors(ทำซ้ำ) */
axiosInstance.interceptors.request.use(
  (config) => {
    /* ดึง token จาก user */
    const token = localStorage.getItem("token");

    /* ถ้ามี token จะใส่ 'Authorization' : `Bearer ${token}` */
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    // 💡 ถ้าเป็น FormData → ห้ามตั้ง Content-Type (axios จะตั้ง boundary ให้เอง)
    else {
      delete config.headers["Content-Type"];
    }
    /* ส่ง object  */
    return config;
  },
  /* เจอ error ก่อนส่ง req จะ reject */
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    /* ถ้า token หมดอายุ  */
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("หมดเวลาการเชื่อมต่อ");

      // ลบ token ใน localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      /*  ไปหน้า Login  */
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
)


export default axiosInstance;
