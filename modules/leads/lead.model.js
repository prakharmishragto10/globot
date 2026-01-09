import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      unique: true,
    },

    fullName: String,
    phone: String,
    email: String,

    highestQualification: String,
    intendedCountry: String,
    intendedCourse: String,

    budgetRange: String,
    englishTestStatus: String,
    intakePreference: String,

    status: {
      type: String,
      enum: ["incomplete", "qualified", "assigned"],
      default: "incomplete",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
