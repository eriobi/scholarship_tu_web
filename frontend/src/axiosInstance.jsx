import axios from "axios";

const axiosInstance  = axios.create({
    baseURL: 'http://localhost:5000/',
     headers: {
        /* backend จะ parse JSON request เท่านั้น*/
      'Content-Type': 'application/json'
    }
})

/* ใส่ token ก่อน req ผ่าน interceptors(ทำซ้ำ) */
axiosInstance.interceptors.request.use(
    (config) => {
        /* ดึง token จาก user */
        const token = localStorage.getItem('token')

        /* ถ้ามี token จะใส่ 'Authorization' : `Bearer ${token}` */
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        /* ส่ง object  */
        return config
    },
    /* เจอ error ก่อนส่ง req จะ reject */
    (error) => Promise.reject(error)


)

export default axiosInstance;