import mongoose from "mongoose";

const intentLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },

    intent: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      default: 1.0, // rule-based = full confidence
    },

    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);
export default mongoose.model("IntentLog", intentLogSchema);
