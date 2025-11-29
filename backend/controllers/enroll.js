import pool from "../pool.js";

let connection = await pool.getConnection();

/* ฟังก์ชันแปลงเงื่อนไขรายได้ */
function parseIntCondition(str) {
  if (!str) return null;

  str = str.trim();  //ลบช่องว่างของ str

 /*  ช่วงตัวเลข เช่น 100000-200000 */
  if (str.includes("-")) {
    const [min, max] = str.split("-").map(v => parseInt(v.trim(), 10)); // แปลงเป็น int ฐาน10 แล้วให้ลบช่องว่าง
    return { type: "range", min, max };
  }

  /* ไม่เกิน X */
  if (str.includes("ไม่เกิน")) {
    const max = parseInt(str.replace("ไม่เกิน", "").trim(), 10);
    return { type: "max", max };
  }

  /*  ต่ำกว่า X */
  if (str.includes("ต่ำกว่า")) {
    const max = parseInt(str.replace("ต่ำกว่า", "").trim(), 10);
    return { type: "less", value: max };
  }

  /* ตัวเลขล้วน เช่น 0 */
  if (/^\d+$/.test(str)) {
    return { type: "max", max: parseInt(str, 10) };
  }

  /*  ให้ null เพื่อให้ main logic ตรวจต่อ */
  return null;
}

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

    /* รายได้ */
    const reqIncome = qualify.req_income;
    const income = student.std_income;

    /* รายได้ไม่ชัดเจนให้ข้าม */
    if ( reqIncome === "ไม่ได้ระบุชัดเจน" || reqIncome === null || reqIncome.trim() === "" || //.trip ลบช่องว่าง
        reqIncome === "ไม่มีขั้นต่ำ" || reqIncome === "0"
    ) {
      // ให้ข้ามการตรวจรายได้
    } else {
      /* parseIntCondition ตรวจ */
      const cond = parseIntCondition(reqIncome);

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
    }

    /* สมคัรยัง */
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
