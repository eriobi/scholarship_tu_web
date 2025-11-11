// db.js

const mysql = require('mysql2/promise');




// ✅ ใช้ connection pool เพื่อรองรับ async/await
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ ทดสอบการเชื่อมต่อ
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database.');
    connection.release();
  }
});



module.exports = pool;


