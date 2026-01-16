import ChatSession from "./chat.model.js";
import ChatMessage from "./chatMessage.model.js";
import { detectIntent } from "./intentDetector.js";
import IntentLog from "./intentLog.model.js";
import {
  getOrCreateLead,
  updateLeadField,
  isLeadQualified,
} from "../leads/lead.service.js";
import { intentToLeadFieldMap } from "./intentToLeadMap.js";
import { createEscalation } from "../escalation/escalation.service.js";
import { findBestKBMatch } from "../knowledgeBase/knowledgeBase.service.js";
import { getGeminiResponse } from "../ai/gemini.service.js";
import { extractName, extractEmail } from "../leads/leadCapture.util.js";

// Start a new chat session

export const startChat = async (req, res) => {
  try {
    //create a session
    const session = await ChatSession.create({});

    //success message
    return res.status(201).json({
      success: true,
      sessionId: session._id,
      message:
        "Hi 👋 I’m GlobeGuide, your overseas education counselor. Before we begin, may I know your name?",
    });
  } catch (error) {
    console.error("CHAT DIDN'T START:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start a new chat session",
    });
  }
};

// End an existing chat session

export const endChat = async (req, res) => {
  try {
    //getting a sessionId from the body
    const { sessionId } = req.body;

    //throw error if no session id is found
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    //find session from the databse

    const session = await ChatSession.findById(sessionId);

    //throw an error if no session id is found
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Chat session not found",
      });
    }

    //ending the session
    session.status = "ended";
    session.endedAt = new Date();
    await session.save();

    return res.json({
      success: true,
      message: "Your chat session has ended",
    });
  } catch (error) {
    //catching the error
    console.error("End chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to end the chat session",
    });
  }
};

/**
 * Send a message in a chat session
 * POST /api/chat/message
 */
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: "sessionId and message are required",
      });
    }

    // 1️ Store user message
    await ChatMessage.create({
      sessionId,
      sender: "user",
      message,
    });

    // 2️ Get or create lead
    const lead = await getOrCreateLead(sessionId);

    let botReply;

    // ===============================
    //  HYBRID LEAD CAPTURE (BLOCKING)
    // ===============================

    // NAME
    if (lead.captureStage === "NEW") {
      const name = extractName(message);

      if (name) {
        await updateLeadField(sessionId, "fullName", name);
        lead.captureStage = "ASKED_EMAIL";
        await lead.save();

        botReply = `Thanks ${name}! 😊 Could you also share your email so I can send you accurate guidance later?`;
      } else {
        botReply = "May I know your name before we continue?";
      }

      await ChatMessage.create({
        sessionId,
        sender: "bot",
        message: botReply,
      });

      return res.json({ success: true, reply: botReply });
    }

    // EMAIL
    if (lead.captureStage === "ASKED_EMAIL") {
      const email = extractEmail(message);

      if (email) {
        await updateLeadField(sessionId, "email", email);
        lead.captureStage = "PROFILE_BUILD";
        await lead.save();

        botReply =
          "Perfect 👍 Now tell me  which country are you planning to study in?";
      } else {
        botReply =
          "That doesn’t look like a valid email. Could you please re-enter it?";
      }

      await ChatMessage.create({
        sessionId,
        sender: "bot",
        message: botReply,
      });

      return res.json({ success: true, reply: botReply });
    }

    // ===============================
    //  NORMAL CHAT FLOW STARTS HERE
    // ===============================

    // 3️ Detect intent
    const { intent, confidence } = detectIntent(message);

    await IntentLog.create({
      sessionId,
      intent,
      confidence,
    });

    // 4️ Update lead fields from intent
    const leadField = intentToLeadFieldMap[intent];
    if (leadField && !lead[leadField]) {
      await updateLeadField(sessionId, leadField, message);
    }

    // 5️ Decide reply
    switch (intent) {
      case "COUNTRY_SELECTION":
        botReply = "Great choice! Which course are you planning to study?";
        break;

      case "COURSE_SELECTION":
        botReply =
          "Nice 👍 Do you already have an English test score like IELTS or PTE?";
        break;

      case "COUNSELOR_REQUEST":
        botReply =
          "Sure! I’ll connect you with one of our expert counselors shortly.";

        await createEscalation({
          sessionId,
          leadId: lead._id,
          reason: "COUNSELOR_REQUEST",
        });

        break;

      default: {
        const kbAnswer = await findBestKBMatch({
          intent,
          message,
          lead,
        });

        //  HARD STOP: KB ALWAYS WINS
        if (kbAnswer?.answer) {
          botReply = kbAnswer.answer;
          break;
        }

        //  AI ONLY WHEN KB FAILS
        botReply = await getGeminiResponse({
          userMessage: message,
          kbContext: null,
          leadContext: {
            country: lead.intendedCountry,
            course: lead.intendedCourse,
            qualification: lead.highestQualification,
          },
        });

        if (!botReply || botReply.length < 25) {
          await createEscalation({
            sessionId,
            leadId: lead._id,
            reason: "LOW_CONFIDENCE",
          });

          botReply =
            "To ensure you get the most accurate guidance, I’ll connect you with a Globetrek Overseas counselor.";
        }

        break;
      }
    }

    // 6️ Qualification check
    if (isLeadQualified(lead)) {
      lead.status = "qualified";
      lead.captureStage = "QUALIFIED";
      await lead.save();
    }

    // 7️ Store bot reply
    await ChatMessage.create({
      sessionId,
      sender: "bot",
      message: botReply,
    });

    return res.json({
      success: true,
      intent,
      reply: botReply,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process message",
    });
  }
};
