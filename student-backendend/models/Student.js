const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});

const AutomationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "processing", "submitted", "failed"],
    default: "pending",
  },

  university: {
    type: String,
    default: "",
  },

  applicationId: {
    type: String,
    default: "",
  },

  submittedAt: {
    type: Date,
  },

  errorMessage: {
    type: String,
    default: "",
  },

  lastAttemptAt: {
    type: Date,
  },

  retries: {
    type: Number,
    default: 0,
  },
});

const StudentSchema = new mongoose.Schema(
  {
    appId: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    personal: {
      type: Object,
      default: {},
    },

    contact: {
      type: Object,
      default: {},
    },

    matric: {
      type: Object,
      default: {},
    },

    inter: {
      type: Object,
      default: {},
    },

    prefs: {
      type: Array,
      default: [],
    },

    guardian: {
      type: Object,
      default: {},
    },

    additional: {
      type: Object,
      default: {},
    },

    automation: {
      type: AutomationSchema,
      default: () => ({}),
    },

    docs: {
      cnic: FileSchema,
      matric: FileSchema,
      inter: FileSchema,
      domicile: FileSchema,
      photo: FileSchema,
      char: FileSchema,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", StudentSchema);