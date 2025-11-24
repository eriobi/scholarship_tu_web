// backend/controllers/scholarshipEligibility.js
import pool from "../pool.js";
import { pushScholarshipDetail } from "../services/LineService.js";

// -------------------- ตรวจสอบสิทธิ์ทุน --------------------
export const getScholarshipEligibility = async (req, res) => {
  const schoId = req.params.id;
  const userId = req.user?.user_id;

  if (!userId) return res.status(401).send("Unauthorized");

  try {
    // 1) ดึงข้อมูลนักศึกษา
    const [studentRows] = await pool.execute(
      `SELECT std_id, std_year, std_gpa, std_income
       FROM student
       WHERE user_id = ?`,
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        eligible: false,
        reasons: ["ไม่พบนักศึกษาในระบบ"],
      });
    }

    const student = studentRows[0];

    // 2) ดึงข้อมูลทุน เพื่อรู้ว่าใช้ qualification อะไร
    const [schRows] = await pool.execute(
      `SELECT scholarship_id, scho_name, qualification
       FROM scholarship_info
       WHERE scholarship_id = ?`,
      [schoId]
    );

    if (schRows.length === 0) {
      return res.status(404).json({
        eligible: false,
        reasons: ["ไม่พบทุนการศึกษา"],
      });
    }

    const sch = schRows[0];
    const quaId = sch.qualification; // foreign key ไปตาราง qualification

    // 3) ดึงเงื่อนไขจากตาราง qualification
    const [quaRows] = await pool.execute(
      `SELECT 
          std_year   AS min_year,
          std_gpa    AS min_gpa,
          std_income AS max_income
       FROM qualification
       WHERE qua_id = ?`,
      [quaId]
    );

    if (quaRows.length === 0) {
      // ถ้าไม่มี qualification เลย ถือว่าผ่าน
      return res.json({
        eligible: true,
        reasons: [],
        alreadySubscribed: false,
      });
    }

    const q = quaRows[0];

    // 4) ตรวจสอบเงื่อนไข
    const reasons = [];

    if (student.std_gpa < q.min_gpa) {
      reasons.push(`GPA ไม่ถึงเกณฑ์ (ขั้นต่ำ ${q.min_gpa})`);
    }

    if (student.std_year < q.min_year) {
      reasons.push(`ชั้นปียังไม่ถึงเกณฑ์ (ขั้นต่ำปี ${q.min_year})`);
    }

    // สมมติความหมาย std_income ใน qualification = "รายได้สูงสุด"
    if (student.std_income > q.max_income) {
      reasons.push(`รายได้เกินเกณฑ์ (ต้องไม่เกิน ${q.max_income})`);
    }

    const eligible = reasons.length === 0;

    return res.json({
      eligible,
      reasons,
      alreadySubscribed: false, // เดี๋ยวค่อยไปเช็คจริงภายหลังได้
    });

  } catch (err) {
    console.error("Eligibility Error:", err);
    return res.status(500).json({ message: "Error checking eligibility" });
  }
};

// -------------------- สมัครรับข้อมูล + ส่ง LINE --------------------
export const subscribeScholarship = async (req, res) => {
  const schoId = req.params.id;
  const userId = req.user?.user_id;

  if (!userId) return res.status(401).send("Unauthorized");

  try {
    // 1) หา std_id จาก user_id (เพราะ table subscribe เก็บ std_id)
    const [studentRows] = await pool.execute(
      `SELECT std_id
       FROM student
       WHERE user_id = ?`,
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบนักศึกษาในระบบ",
      });
    }

    const stdId = studentRows[0].std_id;

    // 2) ถ้าอยาก "กันกดซ้ำ" แบบมี record เดียว ให้เช็คก่อน
    //    ถ้าอยากให้กดได้เรื่อย ๆ แต่เก็บแค่ 1 แถวใน DB ใช้ logic นี้
    const [rows] = await pool.execute(
      `SELECT id 
       FROM scholarship_subscribe
       WHERE std_id = ? AND scholarship_id = ?`,
      [stdId, schoId]
    );

    if (rows.length === 0) {
      // ยังไม่เคย subscribe → insert แถวใหม่
      await pool.execute(
        `INSERT INTO scholarship_subscribe (std_id, scholarship_id)
         VALUES (?, ?)`,
        [stdId, schoId]
      );
    }
    // ถ้า rows.length > 0 = เคย subscribe แล้ว
    // เราจะ "ไม่ throw error" ปล่อยผ่านไป แล้วก็ส่ง LINE ให้ใหม่ได้

    // 3) ดึงข้อมูล user เพื่อเอา line_id
    const [[userRow]] = await pool.execute(
      `SELECT line_id
       FROM users
       WHERE user_id = ?`,
      [userId]
    );

    // 4) ดึงข้อมูลทุน เพื่อเอาไปขึ้นข้อความใน LINE
    const [[schRow]] = await pool.execute(
      `SELECT scholarship_id, scho_name, scho_year,
              scho_type, scho_source,
              start_date, end_date, scho_desp
       FROM scholarship_info
       WHERE scholarship_id = ?`,
      [schoId]
    );

    // 5) ส่งข้อความไป LINE (ถ้ามี line_id)
    if (userRow && userRow.line_id && schRow) {
      await pushScholarshipDetail(userRow.line_id, schRow);
    }

    // 6) ตอบกลับ frontend
    return res.json({
      success: true,
      message: "สมัครรับข้อมูลสำเร็จ และส่งรายละเอียดทุนทาง LINE แล้ว",
    });
  } catch (err) {
    console.error("subscribeScholarship error:", err);
    return res
      .status(500)
      .json({ message: "Error subscribing scholarship" });
  }
};
