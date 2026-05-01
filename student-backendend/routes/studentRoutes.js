const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// multiple file fields (VERY IMPORTANT for your frontend)
router.post(
  "/",
  upload.fields([
    { name: "cnic" },
    { name: "matric" },
    { name: "inter" },
    { name: "domicile" },
    { name: "photo" },
    { name: "char" },
  ]),
  createStudent
);

router.get("/", getStudents);
router.get("/:id", getStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;