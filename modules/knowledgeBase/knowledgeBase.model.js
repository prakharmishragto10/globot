import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "FAQ",
        "COUNTRY",
        "COURSE",
        "VISA",
        "FEES",
        "INTAKE",
        "TEST",
        "GENERAL",
      ],
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: null,
      index: true,
    },

    course: {
      type: String,
      default: null,
      index: true,
    },

    keywords: {
      type: [String],
      default: [],
      index: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("KnowledgeBase", knowledgeBaseSchema);
