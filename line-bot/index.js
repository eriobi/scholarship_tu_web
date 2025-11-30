require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");
const db = require("./db");

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const PORT = Number(process.env.PORT || 3100);
const BYPASS =
  String(process.env.BYPASS_LINE_MW || "").toLowerCase() === "true";

console.log(
  "ENV check:",
  "secretLen=",
  (config.channelSecret || "").length,
  "tokenLen=",
  (config.channelAccessToken || "").length
);

const client = new line.Client(config);

// health check
app.get("/health", (_req, res) => res.send("ok"));

// log ทุก request ที่มายัง webhook
app.use("/webhook", (req, _res, next) => {
  console.log(
    `[REQ] ${req.method} ${req.url} hasSig=${!!req.headers["x-line-signature"]}`
  );
  next();
});


// นักศึกษาติดต่อเจ้าหน้าที่ (ข้อความทุกแบบที่ไม่ใช่ "ลงทะเบียน" / "ทุนทั้งหมด")

async function handleStudentContactMessage(event) {
  const lineUserId = event.source.userId;
  const text = (event.message.text || "").trim();

  console.log("⚙ handleStudentContactMessage from", lineUserId, "text =", text);

  let profile = null;
  let lineDisplayName = null;
  let student = null;
  let studentId = null;

  try {
    // 1) ดึง profile จาก LINE
    try {
      profile = await client.getProfile(lineUserId);
      lineDisplayName = profile?.displayName ?? null;
      console.log("  • LINE displayName =", lineDisplayName);
    } catch (err) {
      console.error("  getProfile error:", err.message);
    }

    // 2) หา student จากตาราง student ด้วย line_user_id
    try {
      const [rows] = await db.query(
        `SELECT std_id, std_name, std_lastname 
         FROM student 
         WHERE line_user_id = ?`,
        [lineUserId]
      );
      if (rows.length > 0) {
        student = rows[0];
        studentId = student.std_id;
        console.log("  • found student:", student);
      } else {
        console.log("  • no student bound to this LINE user");
      }
    } catch (err) {
      console.error("  find student by line_user_id error:", err);
    }

    // 3) เตรียมข้อความสำหรับบันทึกลง admin_message
    const adminTitle = "ข้อความจาก LINE นักศึกษา";

    const adminBodyLines = [];

    if (student) {
      adminBodyLines.push(
        `ชื่อนักศึกษา: ${student.std_name} ${student.std_lastname}`
      );
      adminBodyLines.push(`รหัสนักศึกษา: ${student.std_id}`);
    } else {
      adminBodyLines.push(`ยังไม่ได้ผูกกับข้อมูลนักศึกษาในระบบ`);
    }

    adminBodyLines.push(`ชื่อ LINE: ${lineDisplayName ?? "-"}`);
    adminBodyLines.push(`ข้อความที่ส่งมา: ${text}`);

    const adminBody = adminBodyLines.join("\n");

    // 4) บันทึกลง admin_message
    try {
      await db.query(
        `INSERT INTO admin_message
          (admin_id, student_id, mes_title, mes_desp, mes_status, created_at)
         VALUES (?, ?, ?, ?, 'N', NOW())`,
        [
          1, // admin_id = 1 ชั่วคราว
          studentId, // อาจเป็น null ถ้ายังไม่เจอ student
          adminTitle,
          adminBody,
        ]
      );
      console.log("  • insert admin_message success");
    } catch (err) {
      console.error("  insert admin_message error:", err);
    }

    // 5) บันทึก notification ฝั่ง admin
    try {
      await db.query(
        `INSERT INTO admin_notification
          (admin_id, noti_type, student_id, scholarship_id, is_read, created_at)
         VALUES (?, 'line_contact', ?, NULL, 0, NOW())`,
        [1, studentId]
      );
      console.log("  • insert admin_notification (line_contact) success");
    } catch (err) {
      console.error(
        "  insert admin_notification (line_contact) error:",
        err
      );
    }
  } catch (err) {
    // กัน error หลุดออกไป
    console.error("handleStudentContactMessage outer error:", err);
  }

  // 6) ตอบกลับนักศึกษา (ทำสุดท้ายเสมอ ไม่ว่าข้างบนจะพลาดหรือไม่)
  const replyText = student
    ? `ระบบได้รับข้อความของนักศึกษาแล้ว \n` +
      `ชื่อในระบบ: ${student.std_name} ${student.std_lastname} (${student.std_id})\n` +
      `โปรดรอเจ้าหน้าที่จะตรวจสอบและตอบกลับ`
    : `ระบบได้รับข้อความของนักศึกษาแล้ว \n` +
      `ถ้ายังไม่ได้ลงทะเบียนกับระบบทุนการศึกษา\n` +
      `กรุณาใช้คำสั่ง "ลงทะเบียน รหัสนักศึกษา" ก่อนนะคะ`;

  try {
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: replyText,
    });
    console.log("  • replied to student done");
  } catch (err) {
    console.error("  reply contact message error:", err);
  }

  console.log("handleStudentContactMessage done");
}

// -------------------------------
// BYPASS MODE (ตอน verify เฉย ๆ)
// -------------------------------
if (BYPASS) {
  app.post("/webhook", (req, res) => {
    console.log("🟢 BYPASS mode: return 200");
    res.sendStatus(200);
  });
} else {
  // -------------------------------
  // MODE ปกติ — มี Middleware ของ LINE
  // -------------------------------
  app.post("/webhook", line.middleware(config), async (req, res) => {
    console.log("Received webhook:", JSON.stringify(req.body, null, 2));

    // ต้องตอบ 200 กลับ LINE เสมอ
    res.sendStatus(200);

    const events = req.body?.events || [];
    console.log("Events:", events.length);

    for (const e of events) {
      if (e.type !== "message" || e.message.type !== "text") continue;

      const rawText = e.message.text || "";
      const text = rawText.trim();
      const normalized = text.replace(/\s+/g, " ").trim();
      const lineUserId = e.source.userId;

      console.log(" incoming text:", JSON.stringify(normalized));

      try {
        // -------------------------
        // 1) เคส "ลงทะเบียน 680741145"
        // -------------------------
        const parts = normalized.split(" ");
        if (parts[0] === "ลงทะเบียน" && parts.length >= 2 && parts[1]) {
          const stdId = parts[1];
          console.log("register command:", stdId, "from", lineUserId);

          // ดึงโปรไฟล์ LINE เพื่อเอา displayName
          let lineDisplayName = null;
          try {
            const profile = await client.getProfile(lineUserId);
            lineDisplayName = profile?.displayName || null;
          } catch (e2) {
            console.warn("getProfile error:", e2.message);
          }

          // อัปเดต student
          const [result] = await db.query(
            "UPDATE student SET line_user_id = ?, line_display_name = ? WHERE std_id = ?",
            [lineUserId, lineDisplayName, stdId]
          );

          let replyText;
          if (result.affectedRows > 0) {
            replyText =
              `ลงทะเบียนสำเร็จแล้วสำหรับรหัส ${stdId}\n` +
              `ต่อไประบบจะส่งแจ้งเตือนและรายละเอียดทุนมาที่ LINE บัญชีนี้นะคะ`;
          } else {
            replyText = `ไม่พบรหัสนักศึกษา ${stdId} ในระบบค่ะ`;
          }

          await client.replyMessage(e.replyToken, {
            type: "text",
            text: replyText,
          });

          console.log("handled register");
          continue; // จบ event นี้เลย
        }


        // 2) เคส "ทุนทั้งหมด"
       
        if (normalized === "ทุนทั้งหมด") {
          const [rows] = await db.query(
            "SELECT scho_name FROM scholarship_info WHERE is_active = 1"
          );

          const msg =
            rows.length > 0
              ? "รายชื่อทุนทั้งหมด:\n" +
                rows.map((r) => `• ${r.scho_name}`).join("\n")
              : "ยังไม่มีข้อมูลทุนที่เปิดรับในขณะนี้";

          await client.replyMessage(e.replyToken, {
            type: "text",
            text: msg,
          });
          console.log("Replied scholarship list");
          continue;
        }

       
        // 3) เคสอื่น ๆ → ถือว่าเป็น "ติดต่อเจ้าหน้าที่"

        await handleStudentContactMessage(e);
      } catch (err) {
        console.error("❌ handle error:", err);
        try {
          await client.replyMessage(e.replyToken, {
            type: "text",
            text: "ขออภัย ระบบขัดข้องชั่วคราว ",
          });
        } catch {}
      }
    }
  });
}

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(" LINE middleware error:", err.name, "-", err.message);
  res.status(400).send("LINE middleware error: " + err.message);
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 server :" + PORT + " ready");
});
