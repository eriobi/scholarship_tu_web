import axios from "axios"; //ใช้ axios เพื่อยิง request ไปที่ LINE API
import dotenv from "dotenv"; //โหลดค่าตัวแปรจากไฟล์ .env (เช่น token ของ LINE)
dotenv.config();

/**
 * ส่งข้อความ LINE แจ้งเตือนถึง userId เฉพาะคน
 */
export async function sendLineMessage(userId, message) {
  try {
    const res = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId, // line_user_id ของนักศึกษาใน DB
        messages: [{ type: "text", text: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`, //ใช้ token จาก .env เพื่อยืนยันสิทธิ์
        },
      }
    );
    console.log(`✅ ส่งข้อความถึง ${userId} สำเร็จ`);
    return res.data;
  } catch (error) {
    console.error("❌ ส่งข้อความ LINE ล้มเหลว:", error.response?.data || error.message);
  }
}
