// db.js (แก้ให้รองรับทั้ง DB_PASS และ DB_PASSWORD)
const mysql = require('mysql2/promise');

const isDocker = process.env.NODE_ENV === 'docker';

const pool = mysql.createPool({
  host: process.env.DB_HOST || (isDocker ? 'db' : '127.0.0.1'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'project_db',
  port: Number(process.env.DB_PORT || (isDocker ? 3306 : 3306)),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// test connection เหมือนเดิม
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL database.');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
})();

module.exports = pool;
