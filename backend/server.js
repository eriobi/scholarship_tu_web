import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import stdRoutes from "./routes/stdRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dotenv from "dotenv";
// 🔧 เลือกไฟล์ env อัตโนมัติ ตาม environment ที่รันอยู่
const envFile =
  process.env.NODE_ENV === "docker" ? "./.env" : "./.env.local";

dotenv.config({ path: envFile });
console.log(`🌍 Loaded env file: ${envFile}`);

const PORT = process.env.PORT || 5000;
const app = express();

// ✅ อนุญาตทั้ง frontend container และ localhost (เผื่อเทสจากเครื่องจริง)
const allowedOrigins = [
  "http://frontend:5173",
  "http://localhost:5173",
  "http://localhost:5174" // กรณี frontend รันบน port 5174
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());
app.use("/", authRoutes);
app.use("/user", stdRoutes);
app.use("/admin", adminRoutes);

// ✅ สำหรับเช็คว่า backend ยังรันอยู่ไหม
app.get("/health", (req, res) => res.json({ message: "CORS OK ✅" }));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
