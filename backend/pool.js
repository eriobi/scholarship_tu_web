// backend/pool.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// เลือก host ให้ถูกสำหรับ local / container
const pool = mysql.createPool({
  host: process.env.DB_HOST,   // <<< fix ตรงนี้
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//  รอ DB แบบ retry แต่ **ไม่ kill app**
async function waitForDB(maxRetry = 10, delayMs = 5000) {
  for (let i = 1; i <= maxRetry; i++) {
    try {
      console.log(`🔎 DB check attempt ${i}/${maxRetry} (host=${host})`);
      await pool.query("SELECT 1");
      console.log("✅ Database is ready");
      return;
    } catch (err) {
      console.error(
        `❌ DB not ready (attempt ${i}/${maxRetry}):`,
        err.message
      );

      if (i === maxRetry) {
        console.error(
          "⚠️ DB ยังไม่พร้อมหลังจากลองครบทุกครั้งแล้ว แต่จะไม่ปิด server นะ " +
            "แค่ query ที่ยิงช่วงนี้อาจ error จนกว่า DB จะขึ้น"
        );
        return; // ❗ สำคัญ: ห้าม process.exit() ไม่งั้น nodemon จะ crash
      }

      console.log(`⏳ retry in ${delayMs / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

waitForDB(); // เรียกแต่อย่า await ไว้ที่ top-level

export default pool;
