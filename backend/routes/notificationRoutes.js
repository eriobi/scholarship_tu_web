// backend/routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
} from "../controllers/notification.js";


import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ทุกอันต้องผ่าน verifyToken ก่อน ถึงจะเข้า controller ได้
router.get("/notifications", verifyToken, getNotifications);
router.get("/notifications/unread-count", verifyToken, getUnreadCount);
router.patch("/notifications/:id/read", verifyToken, markNotificationRead);

export default router;
