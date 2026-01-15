import KnowledgeBase from "./knowledgeBase.model.js";
import { intentToKBCategory } from "./intentToKBCategory.js";

export const findBestKBMatch = async ({ intent, message, lead }) => {
  const keywords = message.toLowerCase().split(/\s+/);
  const category = intentToKBCategory[intent];

  const query = {
    isActive: true,

    ...(category && { category }),

    ...(lead?.intendedCountry && { country: lead.intendedCountry }),

    $or: [
      { keywords: { $in: keywords } },
      { question: { $regex: message, $options: "i" } },
    ],
  };

  return KnowledgeBase.findOne(query).sort({ priority: -1 });
};
