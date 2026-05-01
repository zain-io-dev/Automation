require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const automationRoutes = require("./routes/automationRoutes");


const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/students", studentRoutes);

app.use("/api/automation", automationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});