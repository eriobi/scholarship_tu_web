// backend/routes/publicRoutes.js
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

/**
 * ทุนการศึกษา (หน้า list)
 * - ใช้ทั้ง นศ. และคนทั่วไปดูได้ → ไม่ต้องเช็ค token
 */
router.get("/scholarships", getAllScholarship);

/**
 * Bookmark + Enroll (นักศึกษาเท่านั้น)
 * - ใช้ verifyRoleStd แบบเดิมของเพื่อน (ข้างในจัดการเช็ค token+role เอง)
 */
router.get("/bookmarks", verifyRoleStd, getBookmarks);
router.post("/scholarships/:id/bookmark", verifyRoleStd, toggleBookmarks);
router.post("/scholarships/:id/enroll", verifyRoleStd, enroll);

/**
 * สมัครรับข้อมูลทุน (เธอเพิ่ม)
 * - ต้อง login + เป็น role นักศึกษา
 */
router.post(
  "/scholarships/:id/request-info",
  verifyToken,
  verifyRoleStd,
  requestScholarshipInfo
);

/**
 * ข่าวประชาสัมพันธ์ (ทุกคนดูได้)
 */
router.get("/news", getNews);

/**
 *  สถิติของทุน
 * - ตอนนี้ตั้งให้ต้อง login ไว้ก่อน (เหมือนเวอร์ชันที่เธอเขียน)
 *   ถ้าอยากให้คนทั่วไปดูได้ค่อยลบ verifyToken ออกภายหลังได้
 */
router.get("/scholarships/:id/stats", verifyToken, getScholarshipStats);

export default router;
