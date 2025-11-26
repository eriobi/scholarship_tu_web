import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from './routes/authRoutes.js'
import stdRoutes from './routes/stdRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import publicRoutes from './routes/publicRoutes.js'

const PORT = process.env.PORT;


const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.1.100:5173"
]

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}))

if (process.env.NODE_ENV === "docker") {
  dotenv.config({ path: ".env.docker" });
  console.log("Running with .env.docker");
} else {
  dotenv.config({ path: ".env" });
  console.log("Running with .env");
}

/* console.log("ENV CHECK:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST
});
 */
app.use(express.json()); //ให้รับข้อมูล json

/* auth routes */
app.use('/', authRoutes);

/* users routes */
app.use("/user", stdRoutes);
app.use("/admin", adminRoutes);

/* pubilc routes */
app.use("/api",publicRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
