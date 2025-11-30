// backend/routes/scholarshipRoutes.js
import express from "express";

import { 
  getAllScholarship,
  requestScholarshipInfo,
} from "../controllers/scholarshipCard.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyRoleStd from "../middleware/verifyRoleStd.js";
import { getBookmarks, toggleBookmarks } from "../controllers/bookmark.js";
import enroll from "../controllers/enroll.js";
import { getNews } from "../controllers/NewsManagement.js";
import { getScholarshipStats } from "../controllers/scholarshipStats.js";

const router = express.Router();

// ทุนทั้งหมด
router.get("/scholarships", getAllScholarship);

// bookmark
router.get("/bookmarks", verifyRoleStd, getBookmarks);
router.post("/scholarships/:id/bookmark", verifyRoleStd, toggleBookmarks);

// (ของเดิม) สมัครติดตามทุนแบบเก่า ถ้ายังใช้
router.post("/scholarships/:id/enroll", verifyRoleStd, enroll);

//  แบบใหม่: สมัครรับรายละเอียด → เช็คคุณสมบัติ + ส่ง LINE + noti
router.post(
  "/scholarships/:id/request-info",
  verifyToken,
  verifyRoleStd,
  requestScholarshipInfo
);

// ข่าว
router.get("/news", getNews);

// stats
router.get("/scholarships/:id/stats", verifyToken, getScholarshipStats);

export default router;
