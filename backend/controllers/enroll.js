import pool from "../pool.js";


const enroll = async (req, res) => {
  const userId = req.user.user_id; // token จาก verifyRoleStd
  const scholarshipId = req.params.id;

  try {
    /* get ข้อมูลจากตาราง student */
    const [studentRows] = await pool.execute(
      "SELECT std_id, std_year, std_gpa, std_income FROM student WHERE user_id = ?",
      [userId]
    );

    /* เช็คว่าเป็นนักศึกษาเปล่า */
    if (studentRows.length === 0) {
      return res.status(403).json({ message: "นักศึกษาเท่านั้นที่สมัครได้" });
    }

    const student = studentRows[0];
    const studentId = student.std_id;

    /* get idจากตาราง scholarship_info และเงื่อนไขทุนจากตาราง qualification  */
    const [schoRows] = await pool.execute(
      `SELECT s.scholarship_id, s.qualification, 
              q.std_year AS req_year, q.std_gpa AS req_gpa, q.std_income AS req_income
      FROM scholarship_info s
      JOIN qualification q ON s.qualification = q.qua_id
      WHERE scholarship_id = ?`,
      [scholarshipId]
    );

    if (!schoRows.length) {
      return res.status(404).json({ message: "ไม่พบทุน" });
    }

    const qualify = schoRows[0];

    /* เช็คปีการศึกษา */
    if (student.std_year < qualify.req_year) {
      return res.status(400).json({ message: "ชั้นปีไม่ถึงเกณฑ์" });
    }

    /* เช็คเกรด */
    if (student.std_gpa < qualify.req_gpa) {
      return res.status(400).json({ message: "GPA ไม่ถึงเกณฑ์" });
    }

    /* เช็ครายได้ */
    if (student.std_income > qualify.req_income) {
      return res.status(400).json({ message: "รายได้มากกว่าเกณฑ์ที่กำหนด" });
    }

    /* get enroll */
    const [exists] = await pool.execute(
      "SELECT * FROM enroll WHERE std_id = ? AND scho_id = ?",
      [studentId, scholarshipId]
    );

    /* เช็คว่าสมัครรับทุนไปยัง */
    if (exists.length > 0) {
      return res.status(400).json({ message: "คุณสมัครทุนนี้ไปแล้ว" });
    }

    /* ถ้าเงื่อนไขครบ insert ลงตาราง enroll */
    await pool.execute(
      `INSERT INTO enroll (std_id, scho_id, qua_id, enroll_status)
      VALUES (?, ?, ?, ?)`,
      [studentId, scholarshipId, qualify.qualification, 1]
    );

    return res.json({ message: "Enroll Successful" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default enroll;