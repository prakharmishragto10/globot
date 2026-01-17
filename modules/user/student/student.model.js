// modules/user/student/student.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    state: String,
    country: String,

    highestQualification: String,
    intendedCountry: String,
    intendedCourse: String,

    source: {
      type: String,
      enum: ["chatbot", "website", "payment"],
      default: "website",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//  Hash password
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

studentSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Student", studentSchema);
