const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 

// --- ส่วนที่แก้ไข ---
let time = 60000;       // เริ่มต้นที่ 2 ชั่วโมง (7200 วินาที)
let isPaused = true;   // ตั้งค่าเริ่มต้นให้หยุดไว้ก่อน

setInterval(() => {
  if (!isPaused && time > 0) { // ต้องไม่ Pause และเวลาต้องเหลืออยู่ถึงจะลด
    time--;
  }
}, 1000);

// Route สำหรับสั่งให้เริ่มนับ 
app.post("/start", (req, res) => {
  isPaused = false;
  console.log("Timer started!");
  res.json({ success: true, time: time });
});
// ------------------

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "timer.html"), (err) => {
    if (err) res.status(500).send("ไม่พบไฟล์ timer.html");
  });
});

app.post("/addtime", (req, res) => {
  const seconds = Number(req.body.seconds);
  if (!seconds || seconds <= 0) {
    return res.status(400).json({ success: false, message: "invalid seconds" });
  }
  time += seconds;
  res.json({ success: true, time: time });
});

app.get("/time", (req, res) => {
  res.json({ time: time });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Timer server running on port ${PORT}`);
});
