วิธีติดตั้ง code
1. ติดตั้ง docker
2. git clone code
3. ไปที่โฟลเดอร์ที่เก็บ code แล้ว docker compose up --build เพื่อสร้าง image
4. docker compose up -d เพื่อให้สร้าง container และรัน
5. docker compose restart backend ต่อเพื่อให้ backend restart หลังจาก database ทำงานแล้ว *ไม่งั้น backend จะดึงข้อมูลจาก database ไม่ได้*


กรณีเกิด /app/node_modules/.bin/nodemon: 1: ../nodemon/bin/nodemon.js: not found backend exited with code 127 ให้แก้ไขดังนี้
1. ลบโฟลเดอร์ node_modules ในโฟล์เดอร์ backend
2. docker-compose run backend npm install เพื่อสร้าง node_modules ใหม่อีกครั้ง
3. ให้กลับไปยังข้อ 3

ถ้าต้องการ update database
1. วางไฟล์ database ลงในโฟลเดอร์ SCHOLARSHIP_TU_WEB_NOTI
2. docker compose down ลบ image เก่าทั้งหมดออก เพราะ docker จะอ่าน database แค่รอบเดียว
3. docker compose up --build สร้าง image ใหม่
4. docker compose up -d
5. docker compose restart backend

