import express from "express";

import { getAllScholarship } from "../controllers/scholarshipCard.js";
import verifyRoleStd from "../middleware/verifyRoleStd.js";
import { getBookmarks, toggleBookmarks } from "../controllers/bookmark.js";
import enroll from "../controllers/enroll.js";
<<<<<<< Updated upstream

=======
import { getNews } from "../controllers/NewsManagement.js";
import {
  getScholarshipEligibility,
  subscribeScholarship,
} from "../controllers/scholarshipEligibility.js";
>>>>>>> Stashed changes

const router = express.Router();

router.get("/scholarships", getAllScholarship);

// ฝั่งนักศึกษา
router.get("/bookmarks", verifyRoleStd, getBookmarks);
router.post("/scholarships/:id/bookmark", verifyRoleStd, toggleBookmarks);
router.post("/scholarships/:id/enroll", verifyRoleStd, enroll);

// ✅ เช็คสิทธิ์ทุน – ให้นักศึกษาเท่านั้นเรียกได้
router.get(
  "/scholarships/:id/eligibility",
  verifyRoleStd,
  getScholarshipEligibility
);

// สมัครรับข้อมูลทุน – ให้นักศึกษาเท่านั้นเรียกได้
router.post(
  "/scholarships/:id/subscribe",
  verifyRoleStd,
  subscribeScholarship
);

<<<<<<< Updated upstream
export default router;
=======
// ข่าวประชาสัมพันธ์
router.get("/news", getNews);

export default router;
>>>>>>> Stashed changes
