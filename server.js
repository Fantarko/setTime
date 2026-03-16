const express = require("express");
const path = require("path");

const app = express();

// 1. เพิ่ม Middleware สำหรับอ่านข้อมูลจาก Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. ปรับการตั้งค่า Static File และ Path ให้แม่นยำขึ้น
// แนะนำให้ใช้ path.join เพื่อป้องกันปัญหาเรื่องเครื่องหมาย / ในระบบปฏิบัติการที่ต่างกัน
app.use(express.static(path.join(__dirname, "public"))); 

let time = 1800;

// นับถอยหลังทุก 1 วิ
setInterval(() => {
  if (time > 0) {
    time--;
  }
}, 1000);

// 3. ปรับ Route หน้าหลัก
app.get("/", (req, res) => {
  // ตรวจสอบให้แน่ใจว่าไฟล์ timer.html อยู่ในโฟลเดอร์เดียวกับไฟล์ js นี้
  // หรือถ้าแยกโฟลเดอร์ให้ระบุให้ถูกต้อง
  res.sendFile(path.join(__dirname, "timer.html"), (err) => {
    if (err) {
      res.status(500).send("ไม่พบไฟล์ Timer.html ใน Server");
    }
  });
});

// เพิ่มเวลา (Donation)
app.post("/addtime", (req, res) => {
  const seconds = Number(req.body.seconds);

  if (!seconds || seconds <= 0) {
    return res.status(400).json({
      success: false,
      message: "invalid seconds"
    });
  }

  time += seconds;
  console.log("Add time:", seconds, "Total time:", time);

  res.json({
    success: true,
    time: time
  });
});

// ดึงเวลาปัจจุบัน
app.get("/time", (req, res) => {
  res.json({
    time: time
  });
});

// 4. จุดสำคัญสำหรับ Railway: ต้องระบุ Host เป็น 0.0.0.0 
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Timer server running on port ${PORT}`);
});