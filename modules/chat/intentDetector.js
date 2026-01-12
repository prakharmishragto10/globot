const INTENTS = {
  COUNSELOR_REQUEST: [
    "talk to counselor",
    "human",
    "agent",
    "call me",
    "speak to someone",
    "connect me",
    "advisor",
    "counsellor",
  ],

  COUNTRY_SELECTION: [
    "canada",
    "uk",
    "united kingdom",
    "usa",
    "united states",
    "australia",
    "europe",
    "germany",
    "ireland",
  ],

  COURSE_SELECTION: [
    "mba",
    "masters",
    "ms",
    "bachelors",
    "ug",
    "pg",
    "diploma",
    "engineering",
    "computer science",
    "business",
  ],

  FEES_QUERY: ["fees", "cost", "expenses", "tuition", "budget", "how much"],

  VISA_QUERY: ["visa", "study permit", "permit", "pr", "immigration"],

  TEST_REQUIREMENT: ["ielts", "pte", "toefl", "gre", "gmat", "english test"],

  ELIGIBILITY_CHECK: [
    "eligible",
    "eligibility",
    "can i apply",
    "chances",
    "profile",
    "will i get",
  ],

  INTAKE_QUERY: [
    "intake",
    "semester",
    "fall",
    "spring",
    "january",
    "september",
  ],
};

export const detectIntent = (text) => {
  const message = text.toLowerCase();

  let bestMatch = {
    intent: "UNKNOWN",
    confidence: 0,
    matchedKeywords: [],
  };

  for (const [intent, keywords] of Object.entries(INTENTS)) {
    const matches = keywords.filter((word) => message.includes(word));

    if (matches.length > 0) {
      const confidence = Math.min(1, matches.length / keywords.length + 0.3);

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent,
          confidence,
          matchedKeywords: matches,
        };
      }
    }
  }

  return bestMatch;
};
