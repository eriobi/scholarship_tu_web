import pool from "../pool.js";

export const getStudent = async (req, res) => {
    try {
        const [rows] = await pool.execute(

            `SELECT s.*, u.is_active
            FROM student s
            JOIN users u ON s.user_id = u.user_id`
        )

        res.json({ students: rows })

    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}