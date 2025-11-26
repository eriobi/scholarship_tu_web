import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getScholarship, createScholarship, updateScholarship, deleteScholarship } from '../controllers/scholarshipManagement.js'
import { getStudent } from '../controllers/studentManagement.js'
import { getNews, createNews, updateNews, deleteNews } from '../controllers/NewsManagement.js'
import { upload , uploadFields } from "../uploadFile.js";
import { getAdminDashboard } from "../controllers/adminDashboard.js";

const router = express.Router();

/* จัดการนักศึกษา */
router.get("/student", getStudent);

/* จัดการทุน */
router.get("/scholarship", getScholarship);
router.post("/scholarship",uploadFields, createScholarship);
router.patch("/scholarship/:id",uploadFields,updateScholarship);
router.delete('/scholarship', deleteScholarship);


/* จัดการข่าว */
router.get("/news", getNews);
router.post("/news", createNews);
router.patch("/news/:id", updateNews);
router.delete('/news', deleteNews);

router.get("/dashboard",verifyToken, getAdminDashboard);


export default router;