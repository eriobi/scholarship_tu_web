import jwt from "jsonwebtoken";
import pool from "../pool.js";

const verifyToken = async (req, res, next) => {
    const authHeader = req.authHeader['authorization']
    /* ดึง jwt ออกจาก http req header ที่ชื่อว่า authorization  */
    const token = authHeader && authHeader.split(' ')[1]

    const [rows] = await pool.execute("SELECT * FROM users_session WHERE token = ?", [token])

    if (!token) {
        return res.sendStatus(401)
    }

    /* ยืนยันและตรวจสอบ jwt จาก user */
    try{
        const jwtVerify = jwt.verify(token, process.env.JWT_SECRET)

        if (rows.length === 0) {
            return res.status(403).json({ message: "Token invalid or expired" })
        }

        req.user = jwtVerify
        req.token = token 
        next()

    }catch(err){
        return res.sendStatus(403).json({ message: "Token invalid or expired" })
    }

}

export default verifyToken;