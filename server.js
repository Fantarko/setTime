const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static(__dirname))

let time = 1800

// นับถอยหลังทุก 1 วิ
setInterval(() => {
  if (time > 0) {
    time--
  }
}, 1000)


// เพิ่มเวลา (Donation)
app.post("/addtime", (req, res) => {

  let seconds = Number(req.body.seconds)

  if (isNaN(seconds) || seconds <= 0) {
    return res.status(400).json({
      success:false,
      message:"invalid seconds"
    })
  }

  time += seconds

  console.log("Add time:", seconds, "seconds")

  res.json({
    success:true,
    time:time
  })

})


// ดึงเวลาปัจจุบัน
app.get("/time", (req, res) => {

  res.json({
    time:time
  })

})


// ใช้ PORT ของ hosting
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Timer server running on port", PORT)
})