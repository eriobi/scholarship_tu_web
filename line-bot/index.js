require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const db = require('./db'); // ✅ ใช้ connection/pool ของคุณเอง (เช่น db.js หรือ pool.js)

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const PORT = Number(process.env.PORT || 3100);
const BYPASS = String(process.env.BYPASS_LINE_MW || '').toLowerCase() === 'true';

console.log(
  'ENV check:',
  'secretLen=', (config.channelSecret || '').length,
  'tokenLen=', (config.channelAccessToken || '').length
);

app.get('/health', (_req, res) => res.send('ok'));

// log ทุก request ที่เข้ามา
app.use('/webhook', (req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url} hasSig=${!!req.headers['x-line-signature']}`);
  next();
});

const client = new line.Client(config);

// ✅ โหมด BYPASS สำหรับ Verify (แค่ชั่วคราว)
if (BYPASS) {
  app.post('/webhook', (req, res) => {
    console.log('🟢 BYPASS mode: return 200');
    res.sendStatus(200);
  });
} else {
  // ✅ โหมดจริง — ตรวจลายเซ็น, ดึง event, ตอบข้อความ
  app.post('/webhook', line.middleware(config), async (req, res) => {
    res.sendStatus(200); // ตอบ LINE ก่อน
    const events = req.body?.events || [];

    for (const e of events) {
      if (e.type !== 'message' || e.message.type !== 'text') continue;
      const text = e.message.text.trim();

      try {
        if (text === 'ทุนทั้งหมด') {
          const [rows] = await db.query(
            'SELECT scho_name FROM scholarship_info WHERE is_active = 1'
          );

          const msg = rows.length
            ? '📚 รายชื่อทุนทั้งหมด:\n' + rows.map(r => `• ${r.scho_name}`).join('\n')
            : 'ยังไม่มีข้อมูลทุนที่เปิดรับในขณะนี้ค่ะ';

          await client.replyMessage(e.replyToken, { type: 'text', text: msg });
          console.log('✅ Replied scholarship list');
        } else {
          await client.replyMessage(e.replyToken, {
            type: 'text',
            text: `คุณพิมพ์: ${text}`,
          });
          console.log('✅ Echoed message');
        }
      } catch (err) {
        console.error('❌ handle error:', err);
        try {
          await client.replyMessage(e.replyToken, {
            type: 'text',
            text: 'ขออภัย ระบบขัดข้องชั่วคราว 😢',
          });
        } catch {}
      }
    }
  });
}

// --- error handler ---
app.use((err, req, res, next) => {
  console.error('🚨 LINE middleware error:', err.name, '-', err.message);
  res.status(400).send('LINE middleware error: ' + err.message);
});

app.listen(PORT, () => console.log('🚀 server :' + PORT + ' ready'));
