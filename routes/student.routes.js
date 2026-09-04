const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentPut,
  updateStudentPatch,
  deleteStudent,
} = require("../controllers/student.controller");

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudentPut);
router.patch("/:id", updateStudentPatch);
router.delete("/:id", deleteStudent);

module.exports = router;
