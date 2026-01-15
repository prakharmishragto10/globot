import mongoose from "mongoose";

// Basic schema for chat session
const chatSessionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    channel: {
      type: String,
      default: "web",
    },

    // NEW: tracks conversation flow
    stage: {
      type: String,
      enum: ["ASK_NAME", "ASK_EMAIL", "CHAT"],
      default: "ASK_NAME",
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("ChatSession", chatSessionSchema);
