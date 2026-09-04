const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    course: { type: Number, required: true },
    attendance: { type: Boolean, default: false },
    taskStatus: {
      type: String,
      enum: ["bajarilgan", "toliq bajarilmagan", "bajarilmagan"],
      default: "bajarilmagan",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
