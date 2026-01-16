import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },

    email: { type: String, required: true, index: true },
    mobile: { type: String, required: true, index: true },

    state: String,
    country: String,

    course: {
      type: String,
      default: "IELTS",
      index: true,
    },

    plan: {
      type: String,
      enum: ["IELTS_FASTTRACK", "IELTS_ADVANCE", "IELTS_EXPERT"],
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
