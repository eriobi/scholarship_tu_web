// backend/controllers/scholarshipCard.js
import pool from "../pool.js";
import { lineClient } from "../lineClient.js";

// -----------------------------------------------------
// ทุนทั้งหมด
// -----------------------------------------------------
export const getAllScholarship = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
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
      LEFT JOIN qualification q 
        ON s.qualification = q.qua_id
        WHERE s.is_active = 1
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllScholarship error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// เมื่อ นศ. กด "สมัครรับข้อมูล"
// -----------------------------------------------------
export const requestScholarshipInfo = async (req, res) => {
  const userId = req.user.user_id || req.user.id;
  const scholarshipId = req.params.id;

  try {
    // 1) ดึงข้อมูลนักศึกษา
    const [[student]] = await pool.execute(
      `
      SELECT 
        std_id,
        std_year,
        std_gpa,
        std_income,
        line_user_id
      FROM student
      WHERE user_id = ?
      `,
      [userId]
    );

    // 2) ดึงข้อมูลทุน + เงื่อนไข
    const [[scholar]] = await pool.execute(
      `
      SELECT 
        s.scholarship_id,
        s.scho_name,
        s.scho_year,
        s.scho_type,
        s.scho_source,
        s.scho_desp,
        s.start_date,
        s.end_date,
        q.std_year   AS req_year,
        q.std_gpa    AS req_gpa,
        q.std_income AS req_income
      FROM scholarship_info s
      LEFT JOIN qualification q
        ON s.qualification = q.qua_id
      WHERE s.scholarship_id = ?
      `,
      [scholarshipId]
    );

    if (!student || !scholar) {
      return res.status(404).json({ message: "ไม่พบนักศึกษา/ทุน" });
    }

    // -----------------------------
    // 3) ตรวจเงื่อนไขคุณสมบัติ
    //    (null หรือ 0 = ไม่กำหนดเงื่อนไข)
    // -----------------------------
    const normalizeNumber = (v) => {
      if (v == null) return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };

    const reqYear = normalizeNumber(scholar.req_year);
    const reqGpa = normalizeNumber(scholar.req_gpa);

    const passYear =
      reqYear == null || reqYear === 0 || student.std_year === reqYear;

    const passGpa =
      reqGpa == null || reqGpa === 0 || student.std_gpa >= reqGpa;

    // ---- แปลงเงื่อนไขรายได้ให้เป็นตัวเลข / null ----
    let reqIncome = scholar.req_income;

    if (reqIncome != null) {
      if (typeof reqIncome === "string") {
        // ตัด comma แล้วดึงตัวเลข เช่น "100000-200,000" -> ["100000","200000"]
        const cleaned = reqIncome.replace(/,/g, "").trim();
        const matches = cleaned.match(/\d+(\.\d+)?/g);

        if (matches && matches.length > 0) {
          const lastNum = Number(matches[matches.length - 1]);
          reqIncome = Number.isNaN(lastNum) ? null : lastNum;
        } else {
          // ไม่มีตัวเลขเลย เช่น "ไม่ได้ระบุชัดเจน" -> ถือว่าไม่จำกัดรายได้
          reqIncome = null;
        }
      } else if (typeof reqIncome === "number") {
        // ใช้ได้เลย
      } else {
        reqIncome = null;
      }
    }

    // 0 = ไม่จำกัดรายได้
    if (reqIncome === 0) {
      reqIncome = null;
    }

    // แปลงรายได้ นศ. เป็นตัวเลข (กันเคสเป็น string)
    let studentIncome = null;
    if (student.std_income != null) {
      const num = Number(student.std_income);
      studentIncome = Number.isNaN(num) ? null : num;
    }

    const passIncome =
      reqIncome == null ||
      (studentIncome != null && studentIncome <= reqIncome);

    if (!passYear || !passGpa || !passIncome) {
      return res.status(400).json({
        message: "คุณไม่ตรงเงื่อนไขทุนนี้ ไม่สามารถขอรายละเอียดได้",
      });
    }

    // 4) ยังไม่ได้ผูก LINE → แจ้งกลับ frontend เลย
    if (!student.line_user_id) {
      return res.status(400).json({
        message:
          `ยังไม่ได้เชื่อม LINE กับระบบค่ะ ` +
          `กรุณาพิมพ์ "ลงทะเบียน ${student.std_id}" ในห้องแชทกับบอทก่อน`,
      });
    }

    // helper format date
    const formatDate = (value) => {
      if (!value) return "-";
      const d = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
      return d.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // ------ สร้างข้อความเงื่อนไขให้สวยงาม ------
    const yearText =
      reqYear == null || reqYear === 0 ? "ทุกชั้นปี" : String(reqYear);

    const gpaText =
      reqGpa == null || reqGpa === 0 ? "-" : String(reqGpa);

    let incomeText = "-";
    if (scholar.req_income != null) {
      if (reqIncome != null) {
        incomeText = `${reqIncome.toLocaleString("th-TH")} บาท/ปี`;
      } else {
        // parse ไม่ได้ เช่น "ไม่ได้ระบุชัดเจน" หรือ 0 -> แสดงข้อความเดิม
        incomeText = String(scholar.req_income);
      }
    }

    // 5) ข้อความ “รายละเอียดทุน” ที่จะส่งไป LINE
    const detailText =
      `รายละเอียดทุนการศึกษา\n\n` +
      `ชื่อทุน: ${scholar.scho_name}\n` +
      `ปีการศึกษา: ${scholar.scho_year}\n` +
      (scholar.scho_type ? `ประเภททุน: ${scholar.scho_type}\n` : "") +
      (scholar.scho_source ? `แหล่งที่มา: ${scholar.scho_source}\n` : "") +
      `ช่วงเปิดรับ: ${formatDate(scholar.start_date)} - ${formatDate(
        scholar.end_date
      )}\n\n` +
      `เงื่อนไขหลัก:\n` +
      `- ชั้นปีที่รับ: ${yearText}\n` +
      `- เกรดเฉลี่ยขั้นต่ำ: ${gpaText}\n` +
      `- รายได้ไม่เกิน: ${incomeText}\n\n` +
      `กรุณาเข้าสู่ระบบเว็บไซต์ทุนการศึกษาเพื่อดูรายละเอียดเพิ่มเติมและดำเนินการสมัครค่ะ`;

    // 6) ส่งข้อความไป LINE ของ นศ.
    await lineClient.pushMessage(student.line_user_id, {
      type: "text",
      text: detailText,
    });

    // 7) พยายามบันทึก noti ฝั่ง นศ.
    try {
      await pool.execute(
        `
        INSERT INTO std_notification
          (student_id, std_noti_type, scholarship_id, is_read, created_at)
        VALUES
          (?, 'line_sent_detail', ?, 0, NOW())
        `,
        [student.std_id, scholarshipId]
      );
    } catch (e) {
      console.error("insert std_notification error:", e);
      // ไม่ throw ต่อ เพื่อไม่ให้ frontend ได้ 500
    }

    // 8) พยายามบันทึก noti ฝั่ง Admin
    try {
      await pool.execute(
        `
        INSERT INTO admin_notification
          (admin_id, noti_type, student_id, scholarship_id, is_read, created_at)
        VALUES
          (1, 'student_request_info', ?, ?, 0, NOW())
        `,
        [student.std_id, scholarshipId]
      );
    } catch (e) {
      console.error("insert admin_notification error:", e);
    }

    // 9) ตอบกลับให้ frontend รู้ว่า success
    return res.json({
      message: `ระบบได้ส่งรายละเอียดทุน "${scholar.scho_name}" ไปที่ LINE ของคุณแล้ว`,
    });
  } catch (err) {
    console.error("requestScholarshipInfo error:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};
