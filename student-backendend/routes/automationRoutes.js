const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// GET pending students
router.get("/pending", async (req, res) => {
  try {
    const students = await Student.find({
      "automation.status": "pending",
    });

    if (!students.length) {
      return res.json({
        success: false,
        message: "No pending students",
      });
    }

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE automation status
router.put("/update-status/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        automation: req.body,
      },
      { new: true }
    );

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;