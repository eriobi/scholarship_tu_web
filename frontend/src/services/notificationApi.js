// frontend/src/services/notificationApi.js

// axiosInstance คือ instance ของ axios ที่เราตั้ง baseURL = http://localhost:5001 ไว้แล้ว
// และตั้งค่า header / cookie ไว้เรียบร้อย
// ตรงนี้เรา import มาใช้เพื่อยิง request ไปที่ backend
import axiosInstance from "../axiosInstance.jsx";

/*
  ฟังก์ชันนี้ → เรียก API: GET /api/notifications
  - วิ่งจาก frontend → ไปที่ backend server.js
  - server.js map route /api ไปที่ notificationRoutes.js
  - notificationRoutes.js ส่งต่อไปที่ notificationController.getNotifications
  - controller ไปดึงข้อมูลจาก MySQL ตาราง std_notification
  - แล้วส่ง array ของ notification กลับมาที่ frontend
*/
export const fetchNotifications = () => {
  return axiosInstance.get("/api/notifications");
};

/*
  ฟังก์ชันนี้ → เรียก API: GET /api/notifications/unread-count
  - ใช้นับจำนวนแจ้งเตือนที่ is_read = 0
  - เดี๋ยวเราจะเอาไปใช้แสดง “จุดแดงบนไอคอนกระดิ่ง”
*/
export const fetchUnreadCount = () => {
  return axiosInstance.get("/api/notifications/unread-count");
};

/*
  ฟังก์ชันนี้ → เรียก API: PATCH /api/notifications/:id/read
  - ใช้ตอนผู้ใช้กดแจ้งเตือน (อ่านแล้ว)
  - backend จะไป UPDATE std_notification.set is_read = 1
  - เสร็จแล้ว frontend ค่อยอัปเดต state ให้แจ้งเตือนอันนั้นเป็นอ่านแล้ว
*/
export const markNotificationRead = (id) => {
  return axiosInstance.patch(`/api/notifications/${id}/read`);
};
