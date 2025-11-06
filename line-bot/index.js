// ✅ โหลด environment variables จาก .env
require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const db = require('./db');
const axios = require('axios');

const app = express();

// 🧩 ตั้งค่า LINE Bot
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const client = new line.Client(config);

// 🧠 เก็บสถานะผู้ใช้ (เช่น อยู่ในโหมด "ติดต่อเจ้าหน้าที่")
let userStates = {};

// 🟢 LINE Webhook — ห้ามมี express.json() ก่อนหน้านี้เด็ดขาด!
app.post('/webhook', line.middleware(config), async (req, res) => {
  console.log('📩 LINE webhook called!');
  console.log('Body =', JSON.stringify(req.body, null, 2));

  try {
    const events = req.body?.events || [];
    console.log('✅ webhook events =', events.length);

    if (events.length === 0) return res.sendStatus(200);

    await Promise.all(
      events.map(async (event) => {
        // 🟩 ถ้าเป็น postback (กดปุ่ม)
        if (event.type === 'postback' && event.postback.data === 'contact_officer') {
          await client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'พิมพ์ข้อความที่ต้องการติดต่อเจ้าหน้าที่ได้เลยค่ะ 😊',
          });
          userStates[event.source.userId] = 'contacting';
          return;
        }

        // 🟦 ถ้าไม่ใช่ข้อความ text → ข้าม
        if (event.type !== 'message' || event.message?.type !== 'text') return;

        const msg = event.message.text.trim();
        const userId = event.source.userId;
        const userState = userStates[userId];
        let replyText = '';

        console.log('💬 รับข้อความ:', msg);

        // 🧠 ถ้าอยู่ในโหมด "ติดต่อเจ้าหน้าที่"
        if (userState === 'contacting') {
          try {
            await axios.post('http://localhost:3000/api/contact', {
              userId: userId,
              message: msg,
            });
            replyText = 'ส่งข้อความถึงเจ้าหน้าที่เรียบร้อยแล้วค่ะ ✅';
          } catch (err) {
            console.error('❌ ส่งข้อความถึงเจ้าหน้าที่ล้มเหลว:', err.message);
            replyText = 'ขออภัยค่ะ เกิดข้อผิดพลาดในการส่งข้อความ 😢';
          }
          userStates[userId] = null; // ล้างสถานะหลังส่ง
        }

        // ✨ คำสั่งทั่วไป
        else if (msg === 'สวัสดี') {
          replyText = 'สวัสดีค่ะ 😊 ยินดีให้บริการ!';
        } else if (msg === 'ทุน') {
          replyText = 'อยากดูทุนประเภทไหนคะ? เช่น "ทุนทั้งหมด" หรือ "ทุนภายใน"';
        } else if (msg === 'ติดต่อเจ้าหน้าที่') {
          console.log('📞 ผู้ใช้ต้องการติดต่อเจ้าหน้าที่:', userId);
          replyText = 'พิมพ์ข้อความที่ต้องการติดต่อเจ้าหน้าที่ได้เลยค่ะ 😊';
          userStates[event.source.userId] = 'contacting';
        } else if (msg === 'ทุนทั้งหมด') {
          console.log('🔍 ดึงข้อมูลทุนทั้งหมดจากฐานข้อมูล...');
          try {
            const [results] = await db.query('SELECT scho_name FROM scholarship_info');
            const names = results.map((row) => row.scho_name).join('\n');
            const text = names ? `📚 รายชื่อทุนทั้งหมด:\n${names}` : 'ยังไม่มีข้อมูลทุนค่ะ';
            await client.replyMessage(event.replyToken, { type: 'text', text });
          } catch (err) {
            console.error('❌ DB error:', err);
            await client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'เกิดข้อผิดพลาดจากฐานข้อมูล 😢',
            });
          }
          return;
        } else {
          replyText = `รับแล้ว: ${msg}`;
        }

        // ✨ ส่งข้อความตอบกลับ LINE
        try {
          await client.replyMessage(event.replyToken, { type: 'text', text: replyText });
          console.log('✅ ส่งข้อความกลับสำเร็จ');
        } catch (err) {
          console.error(
            '❌ replyMessage error:',
            err.originalError?.response?.data || err.message
          );
        }
      })
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ webhook error:', error);
    res.status(500).send('Webhook Error');
  }
});

// 🟢 หลังจาก webhook แล้วค่อยใช้ express.json()
app.use(express.json());

// ✅ route สำหรับ backend (ให้เว็บเพื่อนรับข้อความจาก LINE)
app.post('/api/contact', (req, res) => {
  const { userId, message } = req.body;
  console.log(`📩 ข้อความจาก LINE User: ${userId}`);
  console.log(`💬 เนื้อหาข้อความ: ${message}`);
  // ตรงนี้คือส่วนที่จะเก็บข้อความลงฐานข้อมูลจริง
  res.send({ success: true });
});

// ✅ health check
app.get('/health', (_req, res) => res.send('ok'));

// ✅ เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
