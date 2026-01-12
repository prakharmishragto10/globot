import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("KEY:", process.env.GEMINI_API_KEY);

export const getGeminiResponse = async ({
  userMessage,
  kbContext = "",
  leadContext = {},
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are GlobeBot, a professional overseas education counselor.

STRICT RULES:
- Answer ONLY study-abroad related questions.
- If not related, politely refuse.
- Use company knowledge first.
- Do NOT guess or invent.
- Ask follow-up questions if data is missing.
- Keep responses concise (5–8 lines).
- No emojis. No markdown.

Company Knowledge:
${kbContext || "No matching company knowledge found."}

Student Context:
${JSON.stringify(leadContext)}

Student Question:
${userMessage}
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI response");
  }
};
