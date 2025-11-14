import pool from "../pool.js";

let connection = await pool.getConnection();

/* get */
export const getBookmarks = async (req, res) => {
  let connection;
  try {
    const userId = req.user.user_id; // จาก token
    connection = await pool.getConnection();

    // ดึง student_id
    const [studentRows] = await connection.execute(
      "SELECT std_id FROM student WHERE user_id = ?",
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRows[0].std_id;

    const [rows] = await connection.execute(
      "SELECT scho_id FROM bookmark WHERE student_id = ? AND is_active = 1",
      [student_id]
    );

    return res.json(rows); // [{scho_id: 1}, {scho_id: 2}, ...]
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

/* add or delete */
export const toggleBookmarks = async (req, res) => {
    try {

        const userId = req.user.user_id// จาก token
        const { id: scho_id } = req.params;

        /* ดึง student_id จาก user_id ก่อน */
        const [studentRows] = await connection.execute(
            "SELECT std_id  FROM student WHERE user_id = ?",
            [userId]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const student_id = studentRows[0].std_id;

        /* ถ้า bookmark อยู่แล้ว เมื่อกดอีกครั้งจะทำการยกเลิก bookmaek */
        const [exists] = await connection.execute('SELECT * FROM bookmark WHERE student_id = ? AND scho_id = ?', [student_id, scho_id])
        //ใช้ length กับ SELECT จะได้ค่า arr ของ obj 
        if (exists.length > 0) {
       /*      const newStatus = rows[0].is_active === 1 ? 0 : 1; */
            //มีอยู่แล้วให้ลบ
            await connection.execute('DELETE FROM bookmark WHERE student_id = ? AND scho_id = ?', [/* newStatus, */ student_id, scho_id])
/*             res.status(201).json({ message: 'bookmark status updated', is_active: newStatus }) */
            return res.status(201).json({ message: 'Bookmark removed' })
        } else {
            //ไม่มีให้เพิ่ม ใส่ return เพราะเมื่อส่ง res จะหยุด execution (ส่ง res เยอะเลยต้อง return)
            return await connection.execute('INSERT INTO bookmark (student_id, scho_id, is_active) VALUE(?,?,?)', ([student_id, scho_id, true]))
        }
        return res.status(200).json({ message: 'Bookmark added', is_active: 1 });
    } catch (err) {
        console.log('add bk err ', err)
        return res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
}

/* export const deleteBookmarks = async (req, res) => {
     try{
        const { scho_id } = req.body;
        const userId = req.user.id

        const [result] = await connection.execute('UPDATE bookmark SET is_active = 0 WHERE student_id = ? AND scho_id = ?',userId,scho_id)

        //ใช้สำหรับ UPDATE/DELETE/INSERT จะได้ obj ที่สรุปว่ามีไรเปลี่ยนแปลงไปบ้าง
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Bookmark not found'})
        }
        return res.status(200).json({ message: 'Bookmark remove succesfully'});
    }catch(err){
        return res.status(500).json({ message: 'Server error' });
    }finally{
        connection.release();
    } 
 
} */