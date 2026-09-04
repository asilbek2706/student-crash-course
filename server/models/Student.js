const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  date: { type: String, required: true },
  attendance: { type: Boolean, default: false },
  taskStatus: {
    type: String,
    enum: ["bajarilgan", "toliq bajarilmagan", "bajarilmagan"],
    default: "bajarilmagan",
  },
});

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    course: { type: Number, required: true },
    history: [historySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
