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
    email: String,
    phone: String,

    highestQualification: String,
    intendedCountry: String,
    intendedCourse: String,

    budgetRange: String,
    englishTestStatus: String,
    intakePreference: String,

    captureStage: {
      type: String,
      enum: [
        "NEW", // just started
        "ASKED_NAME", // name asked
        "ASKED_EMAIL", // email asked
        "PROFILE_BUILD", // answering questions
        "QUALIFIED",
      ],
      default: "NEW",
    },

    status: {
      type: String,
      enum: ["incomplete", "qualified", "assigned"],
      default: "incomplete",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
