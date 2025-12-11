
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import stdRoutes from "./routes/stdRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";


import notificationRoutes from "./routes/notification.js";
import adminNotificationRoutes from "./routes/adminNotification.js";

import { lineMiddleware } from "./lineClient.js";
import { handleLineWebhook } from "./controllers/lineWebhook.js";

dotenv.config()

// ถ้าไม่ได้เซ็ต PORT ใน env จะใช้ 5000 แทน
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.1.100:5173",
];

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // อนุญาตให้ Browser ส่งข้อมูลที่เป็น “credential” ไปพร้อมกับ request ได้  credential เช่น cookies session cookies authorization headers TLS/SSL client certificates
  })
);


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.post("/line/webhook", lineMiddleware, handleLineWebhook);

app.use(express.json());


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
