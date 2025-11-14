import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getBookmarks, toggleBookmarks} from "../controllers/bookmark.js";

const router = express.Router();

router.get('/bookmark',verifyToken,getBookmarks)
router.post('/bookmark',verifyToken,toggleBookmarks)
/* router.delete('/bookmark/:id',verifyToken,deleteBookmarks) */

export default router;