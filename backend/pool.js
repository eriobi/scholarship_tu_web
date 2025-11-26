import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host =
  process.env.ENV === "container" 
    ? "db" 
    : process.env.DB_HOST || "localhost";

const pool = mysql.createPool({
  host: host,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function testDB() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to the Database is successful");
  } catch (err) {
    console.error("Connected to the Database is failed:", err.message);
    process.exit(1);
  }
}

testDB();

export default pool;