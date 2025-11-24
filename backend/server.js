import express from "express";
import cors from "cors";
import dotenv from "dotenv";

<<<<<<< Updated upstream
import authRoutes from "./routes/authRoutes.js";
import stdRoutes from "./routes/stdRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

// 🔧 เลือกไฟล์ env ตาม environment
const envFile =
  process.env.NODE_ENV === "docker" ? "./.env" : "./.env.local";

dotenv.config({ path: envFile });
console.log(`🌍 Loaded env file: ${envFile}`);
=======
import authRoutes from './routes/authRoutes.js'
import stdRoutes from './routes/stdRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import notificationRoutes from "./routes/notificationRoutes.js";



const PORT = process.env.PORT || 5001;

const app = express();
// อนุญาตทั้ง localhost และ IP ในวง 192.168.1.x
app.use(cors({
  origin: (origin, callback) => {
    // อนุญาตถ้าไม่มี origin (เช่น Postman) หรือมาจาก localhost:5173
    if (!origin ||
        origin === "http://localhost:5173" ||
        origin === "http://127.0.0.1:5173") {
      return callback(null, true);
    }

    // อนุญาต IP 192.168.1.x:5173
    const regex = /^http:\/\/192\.168\.1\.\d+:5173$/;
    if (regex.test(origin)) {
      return callback(null, true);
    }

    // ที่เหลือ block
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ เพิ่ม PATCH/OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],             // ✅ ให้ส่ง header token ได้
  credentials: true
}));


app.use(express.json()); //ให้รับข้อมูล json
>>>>>>> Stashed changes

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: อนุญาตทั้ง frontend container และ localhost
const allowedOrigins = [
  "http://frontend:5173",
  "http://localhost:5173",
  "http://localhost:5174", // เผื่อรันอีก port
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* auth routes (login / register) */
app.use("/", authRoutes);

/* users routes */
app.use("/user", stdRoutes);

/* admin routes */
app.use("/admin", adminRoutes);

/* public routes (ข่าว, ทุนทั้งหมด ฯลฯ ใช้หน้าเว็บ) */
app.use("/api", publicRoutes);

// health check สำหรับเช็คว่า backend ยังรันอยู่
app.get("/health", (req, res) => res.json({ message: "CORS OK ✅" }));

/* notification routes */
app.use("/api", notificationRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
