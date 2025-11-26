import pool from "../pool.js";

let connection = await pool.getConnection();

/* รูปแบบแปลง str เป็น int */
function parseIntCondition(str) {
  str = str.trim(); //ลบ space ออก

  /* รายได้อยู่ในช่วง */
  if (str.includes("-")) {
    /* แบ่งตัวเลขจาก '-' แล้ว map(loop arr) เพื่องแปลงเป็น int v.trim(), 10) คือเป็นเลขฐาน 10 โดยลบช่องว่างออก  */
    const [min, max] = str.split("-").map(v => parseInt(v.trim(), 10));
    return { type: "range", min, max };
  }

  /* ไม่เกืน */
  if (str.includes("ไม่เกิน")) {
    /* ลบคำว่าไม่เกินออกให้เหลือแค่ตัวเลข */
    const max = parseInt(str.replace("ไม่เกิน", "").trim(), 10);
    /* return ตัวเลขที่แปลงเรียบร้อบแล้ว */
    return { type: "max", max };
  }

  /* ต่ำกว่า */
  if (str.includes("ต่ำกว่า")) {
    const max = parseInt(str.replace("ต่ำกว่า", "").trim(), 10);
    return { type: "less", value: max };
  }

  /*ตัวเลขล้วน = รายได้ต้องไม่เกิน X .test(str) = เช็คว่าถูกตามรูปแบบ(ตัวเลขล้วน)*/
  if (/^\d+$/.test(str)) {
    return { type: "max", max: parseInt(str, 10) };
  }

  return null; // กรณีรูปแบบไม่ถูกต้อง
}

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

    const student = studentRows[0]; //get ข้อมูลนศของ id นั้นๆ
    const studentId = student.std_id;

    /* get idจากตาราง scholarship_info และเงื่อนไขทุนจากตาราง qualification  */
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

    const qualify = schoRows[0];

    /* เช็คปีการศึกษา */
    if (student.std_year < qualify.req_year) {
      return res.status(400).json({ message: "ชั้นปีไม่ถึงเกณฑ์" });
    }

    /* เช็คเกรด */
    if (student.std_gpa < qualify.req_gpa) {
      return res.status(400).json({ message: "GPA ไม่ถึงเกณฑ์" });
    }
    /* 
        /* เช็ครายได้ 
        if (student.std_income > qualify.req_income) {
          return res.status(400).json({ message: "รายได้มากกว่าเกณฑ์ที่กำหนด" });
        } */

    /* เช็ครายได้ */
    const cond = parseIntCondition(qualify.req_income);
    const income = student.std_income;

    if (!cond) {
      return res.status(400).json({ message: "เงื่อนไขรายได้ของทุนไม่ถูกต้อง" });
    }

    switch (cond.type) {
      case "range":
        if (income < cond.min || income > cond.max) {
          return res.status(400).json({ message: "รายได้ไม่อยู่ในช่วงที่กำหนด" });
        }
        break;

      case "max":
        if (income > cond.max) {
          return res.status(400).json({ message: "รายได้มากกว่าเกณฑ์ที่กำหนด" });
        }
        break;

      case "less":
        if (income >= cond.value) {
          return res.status(400).json({ message: "รายได้ต้องน้อยกว่าเกณฑ์ที่กำหนด" });
        }
        break;
    }

    /* get enroll */
    const [exists] = await connection.execute(
      "SELECT * FROM enroll WHERE std_id = ? AND scho_id = ?",
      [studentId, scholarshipId]
    );

    /* เช็คว่าสมัครรับทุนไปยัง */
    if (exists.length > 0) {
      return res.status(400).json({ message: "คุณสมัครทุนนี้ไปแล้ว" });
    }

    /* ถ้าเงื่อนไขครบ insert ลงตาราง enroll */
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