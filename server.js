const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 

// --- ตัวแปรหลัก ---
let time = 3600;      // เริ่มต้นที่ 1 ชั่วโมง (ปรับตามต้องการ)
let isPaused = true;   // ตั้งค่าเริ่มต้นให้หยุดไว้ก่อน

setInterval(() => {
  if (!isPaused && time > 0) {
    time--;
  }
}, 1000);

// Route สำหรับหน้าหลัก
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "timer.html"), (err) => {
    if (err) res.status(500).send("ไม่พบไฟล์ timer.html");
  });
});

// Route สำหรับเริ่มนับเวลา
app.post("/start", (req, res) => {
  isPaused = false;
  console.log("Timer started!");
  res.json({ success: true, time: time });
});

// --- จุดที่แก้ไขหลัก: รองรับการเพิ่มและลดเวลา ---
app.post("/addtime", (req, res) => {
  const seconds = Number(req.body.seconds);

  // เช็คว่าเป็นตัวเลขหรือไม่ และต้องไม่ใช่ 0 (เพราะ 0 บวกหรือลบไปก็ไม่มีผล)
  if (isNaN(seconds) || seconds === 0) {
    return res.status(400).json({ success: false, message: "ค่า seconds ต้องเป็นตัวเลขที่ไม่ใช่ 0" });
  }

  // คำนวณเวลาใหม่ (บวกด้วยค่าที่ส่งมา ถ้าส่งค่าลบมาเวลาก็จะลดลงอัตโนมัติ)
  time += seconds;

  // ป้องกัน "เวลาติดลบ" (ถ้าโดนแกงจนเวลาเหลือต่ำกว่า 0 ให้เซ็ตกลับเป็น 0)
  if (time < 0) {
    time = 0;
  }

  console.log(`Updated time: ${time} (Changed by: ${seconds})`);
  res.json({ success: true, time: time });
});

// Route สำหรับดึงเวลาไปโชว์ที่หน้าเว็บ
app.get("/time", (req, res) => {
  res.json({ time: time });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Timer server running on port ${PORT}`);
});
