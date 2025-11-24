// frontend/src/services/scholarshipApi.js
import axiosInstance from "../axiosInstance.jsx";

// เรียกดูสิทธิ์ทุน
export const fetchEligibility = (scholarshipId) => {
  return axiosInstance.get(`/api/scholarships/${scholarshipId}/eligibility`);
};

// สมัครรับข้อมูลทุน + ให้ backend ส่ง LINE
export const subscribeScholarship = (scholarshipId) => {
  return axiosInstance.post(`/api/scholarships/${scholarshipId}/subscribe`);
};
