import pool from "../pool.js";
import cron from "node-cron"; //กำหนดเวลาที่จะรันอัตโนมัติ

import { upload } from "../uploadFile.js";

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
        const [row] = await pool.execute(
            `SELECT 
                s.scholarship_id,
                s.scho_name,
                s.scho_year,
                s.scho_type,
                s.scho_source,
                s.start_date,
                s.end_date,
                s.scho_desp,
                s.is_active,
                q.qua_id,
                q.std_year,
                q.std_gpa,
                q.std_income
            FROM scholarship_info s
            JOIN qualification q 
            ON s.qualification = q.qua_id`
        )
        res.json(row)

    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

/* เพิ่มทุน */
export const createScholarship = async (req, res) => {
    const { schoName, schoYear, std_year, std_gpa, std_income, type, source, startDate, endDate, desp, is_active } = req.body

    const sqlAdd = `INSERT INTO scholarship_info (scho_name,scho_year,qualification,scho_type,scho_source,start_date,end_date,scho_desp,scho_file,image_file,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    const quaAdd = `INSERT INTO qualification (std_year,std_gpa,std_income) VALUES (?,?,?)`

    let pdf = req.files?.file ? req.files.file[0].filename : null;
    let image = req.files?.image ? req.files.image[0].filename : null;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        
if (req.files) {
  if (req.files.file) pdf = req.files.file[0].filename;
  if (req.files.image) image = req.files.image[0].filename;
}

        /* ตาราง qualification */
        const [quaResult] = await connection.execute(quaAdd, [std_year, std_gpa, std_income]);
        const quaId = quaResult.insertId;

        /* ตาราง Scholarship */
        const [schResult] = await connection.execute(sqlAdd, [schoName, schoYear, quaId, type, source, startDate, endDate, desp, pdf, image, true])
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
  const { id } = req.params;
  const updateData = req.body;

  connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
     /* โหลดข้อมูลเดิม (ใช้ไฟล์เก่าถ้าไม่ได้อัปใหม่) */
    const [oldRows] = await connection.execute(
      "SELECT scho_file, image_file FROM scholarship_info WHERE scholarship_id = ?",
      [id]
    );

    const old = oldRows[0];

    /* ตั้งค่าไฟล์ */
    let pdf = old?.scho_file || null;
    let image = old?.image_file || null;

    if (req.files?.file) pdf = req.files.file[0].filename;
    if (req.files?.image) image = req.files.image[0].filename;

   /*  mappedData ให้ col ที่ถูกส่งมาตรงกับ col ใน db */
    const mappedData = {
      scho_name: updateData.schoName,
      scho_year: updateData.schoYear,
      scho_type: updateData.type,
      scho_source: updateData.source,
      scho_desp: updateData.desp,
      start_date: updateData.startDate,
      end_date: updateData.endDate,
      is_active: updateData.is_active,
      scho_file: pdf,
      image_file: image
    };

    /* ถ้าไม่มี update ให้ผ่าน */
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data to update" });
    }

    /* สร้างให้รองรับ data */
    const fields = [];
    const values = [];

    /* Object.entries แปลง mappedData แล้วคืนค่าเป็น key, value */
    for (const [key, value] of Object.entries(mappedData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    const query = `UPDATE scholarship_info SET ${fields.join(",")} WHERE scholarship_id = ?`;
    values.push(id);

    const [result] = await connection.execute(query, values);

    /* update qualification ด้วย*/
    if (updateData.std_year || updateData.std_gpa || updateData.std_income) {
      const [oldSch] = await connection.execute(
        "SELECT qualification FROM scholarship_info WHERE scholarship_id = ?",
        [id]
      );

      const quaId = oldSch[0]?.qualification;

      if (quaId) {
        await connection.execute(
          `UPDATE qualification SET std_year = ?, std_gpa = ?, std_income = ? WHERE qua_id = ?`,
          [updateData.std_year, updateData.std_gpa, updateData.std_income, quaId]
        );
      }
    }

    /* affectedRows = rows มีการเปลี่ยนแปลงไหม */
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "updated successfully" });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  } finally {
    connection.release();
  }
};


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
        return res.status(500).json({ message: 'delete is failed ,Server error' })
    }
}
