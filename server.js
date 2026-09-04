require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/Student");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Barcha talabalarni olish (GET)
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ID orqali bitta talabani olish (GET by ID)
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Talaba topilmadi" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Yangi talaba qo'shish (POST)
app.post("/api/students", async (req, res) => {
  try {
    const { fullName, course, attendance, taskStatus } = req.body;
    const newStudent = await Student.create({
      fullName,
      course,
      attendance,
      taskStatus,
    });
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Talabani to'liq tahrirlash (PUT)
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Talaba topilmadi" });
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Talabani qisman tahrirlash (PATCH - davomat yoki vazifa uchun)
app.patch("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Talaba topilmadi" });
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Talabani o'chirish (DELETE)
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Talaba topilmadi" });
    res.status(200).json({ message: "Talaba muvaffaqiyatli o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

const bootstrap = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Listening on - http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};

bootstrap();
