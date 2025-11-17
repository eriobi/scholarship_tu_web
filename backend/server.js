import express from "express";
import cors from "cors";

import authRoutes from './routes/authRoutes.js'
import stdRoutes from './routes/stdRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import publicRoutes from './routes/publicRoutes.js'

const PORT = process.env.PORT;

const app = express();
app.use(cors({
  origin: /^http:\/\/192\.168\.1\.\d+:5173$/,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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
