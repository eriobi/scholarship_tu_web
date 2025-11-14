import pool from '../pool.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "data are required" });
    }

    const sql = `SELECT * FROM users WHERE email = ? AND is_active = 1`
    const sqlSession = `INSERT INTO users_session (user_id,token,is_active) VALUES (?, ?, ?) `

    try {
        const [rows] = await pool.execute(sql, [email])

        /* หา email */
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email invalid' });
        }

        /* ข้อมูลแรกที่ได้จากการคืนค่าของ pool */
        const user = rows[0];

        /* เปรียบเทียบรหัสผ่าน */
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'invalid credentials' })
        }

        /* เก็บ token */
        const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        await pool.execute(sqlSession, [user.user_id, token, true])


        res.json({ message: 'Login successfully', token, role: user.role })


    } catch (err) {

        console.log(err)
        return res.status(500).json({ message: 'Server error' })

    }
}

export default login;