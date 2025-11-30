// backend/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import stdRoutes from "./routes/stdRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

// 🔔 routes ฝั่ง notification ที่เธอเพิ่ม
import notificationRoutes from "./routes/notification.js";
import adminNotificationRoutes from "./routes/adminNotification.js";

// 🔔 LINE webhook ที่เธอเพิ่ม
import { lineMiddleware } from "./lineClient.js";
import { handleLineWebhook } from "./controllers/lineWebhook.js";

// โหลดไฟล์ env ตาม NODE_ENV (เหมือนของเพื่อน)
if (process.env.NODE_ENV === "docker") {
  dotenv.config({ path: ".env.docker" });
  console.log("Running with .env.docker");
} else {
  dotenv.config({ path: ".env" });
  console.log("Running with .env");
}

// ถ้าไม่ได้เซ็ต PORT ใน env จะใช้ 5000 แทน
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.1.100:5173",
];

const app = express();

// ตั้งค่า CORS (เอา logic จากของเพื่อนมารวมกับ allowedOrigins เดิม)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// สำคัญ: ต้องประกาศ LINE webhook ก่อน express.json()
// เพราะ lineMiddleware ต้องอ่าน raw body เพื่อ verify signature
app.post("/line/webhook", lineMiddleware, handleLineWebhook);

// ให้รับ JSON สำหรับ route อื่น ๆ
app.use(express.json());

// ให้โหลดไฟล์ในโฟลเดอร์ uploads ได้ (ของเพื่อนมีอยู่แล้ว)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* auth routes */
app.use("/", authRoutes);

/* users/admin routes */
app.use("/user", stdRoutes);
app.use("/admin", adminRoutes);

/* public routes */
app.use("/api", publicRoutes);

/* notification routes */
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
