FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# .sh executable ภายใน container
RUN chmod +x wait-for-it.sh
EXPOSE 5000
# ใช้ wait-for-it.sh รอ MySQL พร้อมก่อน start backend
CMD ["./wait-for-it.sh", "db:3306", "--timeout=30", "--strict", "--", "npm", "run", "dev"]