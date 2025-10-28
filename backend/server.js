import express from "express";
import cors from "cors";

import authRoutes from './routes/authRoutes.js'
import stdRoutes from './routes/stdRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json()); //ให้รับข้อมูล json

/* auth routes */
app.use('/', authRoutes);

/* user routes */
app.use("/user", stdRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
