import mongoose from "mongoose";

const escalationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "COUNSELOR_REQUEST",
        "QUALIFIED_LEAD",
        "CONFUSION",
        "LOW_CONFIDENCE",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EscalationRequest", escalationSchema);
