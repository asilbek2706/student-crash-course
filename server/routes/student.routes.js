const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentPut,
  updateStudentPatch,
  deleteStudent,
} = require("../controllers/student.controller");

router.use(authMiddleware);

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudentPut);
router.patch("/:id", updateStudentPatch);
router.delete("/:id", deleteStudent);

module.exports = router;
