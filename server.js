require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/student.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const bootstrap = async () => {
  try {
    await mongoose
      .connect(DB_URL)
      .then(() => console.log("Connected to the database"));
    app.listen(PORT, () => {
      console.log(`Listening on - http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};

bootstrap();
