import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {getScholarship, createScholarship ,updateScholarship , deleteScholarship}  from '../controllers/scholarshipManagement.js'
import {getStudent} from '../controllers/studentManagement.js'

const router = express.Router();

/* จัดการนักศึกษา */
router.get("/student", getStudent);

/* จัดการทุน */
router.get("/scholarship", getScholarship);
router.post("/scholarship", createScholarship);
router.patch("/scholarship/:id", updateScholarship);
router.delete('/scholarship', deleteScholarship);

export default router;