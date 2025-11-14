import pool from '../pool.js'

export const getAllScholarship = async (req, res) => {
    try {
        const [rows] = await pool.execute(`SELECT 
                s.scholarship_id,
                s.scho_name,
                s.scho_year,
                s.scho_type,
                s.scho_source,
                s.start_date,
                s.end_date,
                s.scho_desp,
                s.is_active,
                s.is_delete,
                q.qua_id,
                q.std_year,
                q.std_gpa,
                q.std_income
            FROM scholarship_info s
            JOIN qualification q 
            ON s.qualification = q.qua_id
            ORDER BY s.created_at DESC`) //เรียงจากใหม่ไปเก่า LEFT เพื่อให้ทุนที่ไม่มีเงื่อนไขปรากฏขึ้น
        res.json(rows)
    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

/* export const getScholarshipById = async (req, res) => {
    const { id } = req.params
    try {
        const [rows] = await pool.execute(`SELECT scholarship_id,scho_name,scho_year,scho_type,scho_source,start_date,end_date,is_active 
            FROM scholarship_info
            WHERE scholarship_id = ?`, [id])
        if (rows.length === 0) return res.status(404).json({ message: 'Scholarship not found' })
        res.json(rows[0]);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getQualification = async (req,res) => {
    const { id } = req.params
    try{
        const [rows] = await pool.execute(
            `SELECT q.std_year,q.std_gpa,q.std_income
            FROM qualification q
            JOIN scholarship_info s ON q.qua_id = s.scholarship_id
            WHERE s.scholarship_id = ?`
        )
        if (rows.length === 0) return res.status(404).json({ message: 'Qualification not found' })
        res.json(rows[0]);

    }catch(err){
        return res.status(500).json({ message: 'Server error' })
    }   
} */