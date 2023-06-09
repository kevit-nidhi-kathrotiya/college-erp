import mongoose from "mongoose";

const { Schema, model } = mongoose;

// ===============================================================================
// APIs schema to validate requests
// ===============================================================================

// ----------------------------------------------------------------------------
// Student Schema for store in DB
// ----------------------------------------------------------------------------
const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emailId: String,

    mobileNo: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
      enum: ["CE", "IT", "ME", "EC", "EE"],
    },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "batch",
    },

    currentSem: {
      type: Number,
      required: true,
    },
    accessToken: Schema.Types.String,
  },
  { timestamps: true }
);

const attendanceSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      ref: "batches",
    },

    branch: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    students: [
      {
        isPresent: {
          type: Boolean,
          required: true,
        },
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "students",
        },
      },
    ],
  },
  { timestamps: true }
);

studentSchema.index({ email: 1 }, { unique: true });

const batchSchema = new Schema(
  {
    strict: false,
  },
  {
    collection: "batches",
  }
);

export const Student = model("student", studentSchema);
export const StudentAttendance = model("attendance", attendanceSchema);
export const Batch = mongoose.model("batch", batchSchema);
