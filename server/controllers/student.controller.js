const Student = require("../models/Student");

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Talaba topilmadi" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { fullName, course } = req.body;
    const newStudent = await Student.create({ fullName, course, history: [] });
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateStudentPut = async (req, res) => {
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
};

// Sana bo'yicha kunlik davomat va vazifani boshqarish (PATCH)
const updateStudentPatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, attendance, taskStatus } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Talaba topilmadi" });

    if (!student.history) {
      student.history = [];
    }

    const historyIndex = student.history.findIndex((h) => h.date === date);

    if (historyIndex > -1) {
      if (attendance !== undefined) {
        student.history[historyIndex].attendance = attendance;
      }
      if (taskStatus !== undefined) {
        student.history[historyIndex].taskStatus = taskStatus;
      }
    } else {
      student.history.push({
        date,
        attendance: attendance !== undefined ? attendance : false,
        taskStatus: taskStatus !== undefined ? taskStatus : "bajarilmagan",
      });
    }

    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Talaba topilmadi" });
    res.status(200).json({ message: "Talaba muvaffaqiyatli o'chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentPut,
  updateStudentPatch,
  deleteStudent,
};
