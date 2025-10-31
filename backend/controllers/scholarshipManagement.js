import pool from "../pool.js";
import cron from "node-cron"; //กำหนดเวลาที่จะรันอัตโนมัติ

let connection;

/* update ทุน auto ว่าหมดเขตยัง */
cron.schedule('0 0 * * *', async () => { // 0=นาที 0=ชม 0=วัน(เดือน) 0=เดือน 0=วัน(สัปดาห์) ในทีนี้คือเที่ยงคืน
    connection = await pool.getConnection();

    /* แปลงเป็น str เก็บเป็น 'YYYY-MM-DD'   */
    const today = new Date().toISOString().split("T")[0];

    /* เปิดทุน เมื่อ start มากกว่า/เท่ากับวันนี้และ end น้อยกว่า/วันนี้ ให้ set 1 */
    await connection.query(
        `UPDATE scholarship_info SET is_active = 1 WHERE start_date <= ? AND end_date >= ?`,
        [today, today]
    )

    /* ปิดทุน เมื่อทุน = 1 ถ้า end น้อยกว่าวันนี้ หรือ start มากกว่าวันนี้ ให้ set 0 */
    await connection.query(
        'UPDATE scholarship_info SET is_active = 0 WHERE (end_date < ? OR start_date > ?) AND is_active = 1',
        [today], [today]
    )
    connection.release();
    console.log('Scholarships status updated');
})

/* get ข้อมูลทุน */
export const getScholarship = async (req, res) => {
    try {
        const [row] = await pool.execute('SELECT * FROM scholarship_info')
        res.json(row)

    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

/* เพิ่มทุน */
export const createScholarship = async (req, res) => {
    const { schoName, schoYear, std_year, std_gpa, std_income, type, source, startDate, endDate, desp, is_active } = req.body

    const sqlAdd = `INSERT INTO scholarship_info (scho_name,scho_year,qualification,scho_type,scho_source,start_date,end_date,scho_desp,is_active) VALUES (?,?,?,?,?,?,?,?,?)`
    const quaAdd = `INSERT INTO qualification (std_year,std_gpa,std_income) VALUES (?,?,?)`
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        /* ตาราง qualification */
        const [quaResult] = await connection.execute(quaAdd, [std_year, std_gpa, std_income]);
        const quaId = quaResult.insertId;

        /* ตาราง Scholarship */
        const [schResult] = await connection.execute(sqlAdd, [schoName, schoYear, quaId, type, source, startDate, endDate, desp, true])
        const SchId = schResult.insertId
        await connection.commit();
        res.status(201).json({ message: 'Created succesfully', SchId })
    } catch (err) {
        //console.log(err)
        return res.status(500).json({ message: 'Create is failed , Server error' })
    } finally {
        connection.release();
    }
}

/* แก้ไขทุน  */
export const updateScholarship = async (req, res) => {
    const { id } = req.params; /* ดึง id ผ่าน url  */
    const updateData = req.body;/* ดึงข้อมูลที่ต้องการ update ที่ถูกส่งมาจาก req.body */

    const mappedData = {
        scho_name: updateData.schoName,
        scho_year: updateData.schoYear,
        scho_type: updateData.type,
        scho_source: updateData.source,
        scho_desp: updateData.desp,
        start_date: updateData.startDate,
        end_date: updateData.endDate,
        is_active: updateData.is_active,
    };

    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        /* ข้อมูลถูกส่งมาไหม ,คืนค่า object.keys array ของชื่อ key  */
        if (!Object.keys(updateData).length) {
            return res.status(404).json({ message: 'There is no information to update' })
        }
        const [rows] = await connection.query(
            "SELECT is_active FROM scholarship_info WHERE scholarship_id = ?",
            [id]
        );
        const oldValue = rows[0]?.is_active;
        console.log("DB value:", oldValue);
        console.log("New value:", mappedData.is_active);

        /* รอรับค่า */
        const fields = []
        const values = []
        /* loop */
        for (const [key, value] of Object.entries(mappedData)) { //Object.entries คล้าย map
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        /* update ข้อมูล */
        const query = `UPDATE scholarship_info SET ${fields.join(',')} WHERE scholarship_id = ?` //fields.join = รวมเป็น string ,scho_id = ? ที่ id นั้นๆ
        values.push(id);
        const [result] = await connection.execute(query, values);

        /* ไม่พบทุนที่ต้องการ update */
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Scholarship invalid' })
        }
        await connection.commit();
        res.status(200).json({ message: 'updated succesfully' })

    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Update failed, server error' });
        }

    } finally {
        connection.release();
    }
}

/* ลบทุน */
export const deleteScholarship = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No IDs provided" });
    try {
        const placeholders = ids.map(() => "?").join(","); //รับค่าแล้วมาแปลงเป็น ? เพื่อรองรับ ส่วน join รวม arr
        const sql = `DELETE FROM scholarship_info WHERE scholarship_id IN (${placeholders})`; //IN หลายรายการ 
        await pool.query(sql, ids);
        res.status(204).json({ message: 'deleted succesfully' })

    } catch (err) {
        return res.status(500).json(err/* { message: 'delete is failed ,Server error' } */)
    }
}
