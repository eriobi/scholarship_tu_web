import pool from "../pool.js";

export const getStudent = async (req , res) => {
    try{
        const[row] = await pool.execute('SELECT * FROM student')
        const[is_active] = await pool.execute('SELECT is_active FROM user')
        res.json(row,is_active)

    }catch(err){
        return res.status(500).json({ message: 'Server error' })
    }
}