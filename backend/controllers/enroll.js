import pool from "../pool.js";

let connection = await pool.getConnection();

const enroll = async (req, res) => {
  const userId = req.user.user_id;
  const scholarshipId = req.params.id;

  try {
    /* ข้อมูลนักศึกษา */
    const [studentRows] = await pool.execute(
      "SELECT std_id, std_year, std_gpa, std_income FROM student WHERE user_id = ?",
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(403).json({ message: "นักศึกษาเท่านั้นที่สมัครได้" });
    }

    const student = studentRows[0];
    const studentId = student.std_id;

    /* ข้อมูลทุน + เงื่อนไขคุณสมบัติ */
    const [schoRows] = await connection.execute(
      `SELECT s.scholarship_id, s.qualification, 
              q.std_year AS req_year, q.std_gpa AS req_gpa, q.std_income AS req_income
       FROM scholarship_info s
       JOIN qualification q ON s.qualification = q.qua_id
       WHERE scholarship_id = ?`,
      [scholarshipId]
    );

    if (!schoRows.length) {
      return res.status(404).json({ message: "scholarship not found" });
    }

    /* เช็คคุณสมบัติ */
    const qualify = schoRows[0];

    // ปีการศึกษา
    if (student.std_year < qualify.req_year) {
      return res.status(400).json({ message: "ชั้นปีไม่ถึงเกณฑ์" });
    }

    /* เกรด */
    if (student.std_gpa < qualify.req_gpa) {
      return res.status(400).json({ message: "GPA ไม่ถึงเกณฑ์" });
    }

    /* รายได้ (เวอร์ชันใหม่: รองรับเฉพาะ "ไม่เกิน X") */
    let reqIncome = qualify.req_income?.trim();
    const income = student.std_income;

    // กรณีที่ข้ามการตรวจรายได้
    if (
      !reqIncome || 
      reqIncome === "0" ||
      reqIncome === "ไม่มีขั้นต่ำ" ||
      reqIncome === "ไม่ได้ระบุชัดเจน"
    ) {
      // ไม่ตรวจรายได้
    } else {
      // แปลงค่าเป็นตัวเลขล้วน เช่น "200000"
      const maxIncome = parseInt(reqIncome.replace(/\D/g, ""), 10);

      if (isNaN(maxIncome)) {
        return res
          .status(400)
          .json({ message: "เงื่อนไขรายได้ของทุนไม่ถูกต้อง" });
      }

      // ตรวจ: รายได้ต้อง <= req_income
      if (income > maxIncome) {
        return res
          .status(400)
          .json({ message: "รายได้มากกว่าเกณฑ์ที่กำหนด" });
      }
    }

    /* เช็คว่าสมัครไปแล้วหรือยัง */
    const [exists] = await connection.execute(
      "SELECT * FROM enroll WHERE std_id = ? AND scho_id = ?",
      [studentId, scholarshipId]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "คุณสมัครทุนนี้ไปแล้ว" });
    }

    /* บันทึกลง db */
    await connection.execute(
      `INSERT INTO enroll (std_id, scho_id, qua_id, enroll_status)
       VALUES (?, ?, ?, ?)`,
      [studentId, scholarshipId, qualify.qualification, 1]
    );

    await connection.commit();

    return res.json({ message: "Enroll Successful" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export default enroll;
