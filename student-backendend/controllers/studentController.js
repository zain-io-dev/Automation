const Student = require("../models/Student");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// CREATE STUDENT

const createStudent = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);

    const files = req.files;

    const uploadedFiles = {};

    // Loop through each field
    for (let field in files) {
      const file = files[field][0];

      const result = await uploadToCloudinary(
        file.buffer,
        "students/docs"
      );

      uploadedFiles[field] = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Attach uploaded docs as objects matching the schema
    data.docs = uploadedFiles;

    // Ensure root-level email is set for the unique index
    data.email = data.contact?.email || undefined;

    // Save to DB
    const student = await Student.create(data);

    res.status(201).json({
      success: true,
      data: student,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createStudent = createStudent;

// GET ALL
exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// GET ONE
exports.getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.json(student);
};

// UPDATE
exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE
exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};