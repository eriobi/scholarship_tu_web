// backend/services/lineService.js
import axios from "axios";

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message/push";
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; // ใส่ใน .env

// ฟังก์ชันส่งข้อความรายละเอียดทุนไปหานักศึกษา
export async function pushScholarshipDetail(toLineId, scholarship) {
  if (!toLineId) {
    console.log("ไม่มี line_id ไม่สามารถส่ง LINE ได้");
    return;
  }

  if (!LINE_ACCESS_TOKEN) {
    console.error("LINE_ACCESS_TOKEN is not set");
    return;
  }

  const {
    scho_name,
    scho_year,
    scho_type,
    scho_source,
    start_date,
    end_date,
    scho_desp,
  } = scholarship;

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    const day = String(dt.getDate()).padStart(2, "0");
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const year = dt.getFullYear() + 543; // ถ้าอยากใช้ พ.ศ.
    return `${day}/${month}/${year}`;
  };

  const textMessage =
    `📚 รายละเอียดทุนการศึกษา\n` +
    `ชื่อทุน: ${scho_name}\n` +
    `ปีการศึกษา: ${scho_year}\n` +
    `ประเภท: ${scho_type} (${scho_source})\n` +
    `เปิดรับ: ${formatDate(start_date)}\n` +
    `ปิดรับ: ${formatDate(end_date)}\n\n` +
    (scho_desp ? `รายละเอียด: ${scho_desp}\n\n` : "") +
    `หากต้องการสมัคร / ดูรายละเอียดเพิ่มเติม\n` +
    `กรุณาเข้าเว็บไซต์ทุนการศึกษาของคณะ`;

  try {
    await axios.post(
      LINE_MESSAGING_API,
      {
        to: toLineId,
        messages: [
          {
            type: "text",
            text: textMessage,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        },
      }
    );

    console.log("ส่งข้อความทุนทาง LINE สำเร็จ");
  } catch (err) {
    console.error("Error sending LINE message:", err.response?.data || err);
  }
}
