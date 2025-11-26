FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
#เพิ่ม nodemon
RUN npm install -g nodemon 
COPY . .
#COPY  .env ./
# .sh executable ภายใน container
RUN sed -i 's/\r$//' wait-for-it.sh && chmod +x wait-for-it.sh
EXPOSE 5000
# ใช้ wait-for-it.sh รอ MySQL พร้อมก่อน start backend
CMD ["./wait-for-it.sh", "db:3306", "--timeout=30", "--strict", "--", "npm", "run", "dev"]