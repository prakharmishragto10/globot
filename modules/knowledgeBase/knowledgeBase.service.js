import KnowledgeBase from "./knowledgeBase.model.js";

export const findBestKBMatch = async ({ intent, message, lead }) => {
  const keywordTokens = message.toLowerCase().split(" ");

  return KnowledgeBase.findOne({
    isActive: true,
    ...(lead?.intendedCountry && { country: lead.intendedCountry }),
    $or: [
      { category: intent.replace("_QUERY", "") },
      { keywords: { $in: keywordTokens } },
    ],
  }).sort({ priority: -1 });
};
