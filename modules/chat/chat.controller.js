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
        "Hi I’m GlobeBot. Let me help you start your study abroad journey.",
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

    //1:=> Store user message
    await ChatMessage.create({
      sessionId,
      sender: "user",
      message,
    });

    // 2️:=> Detect intent
    const intent = detectIntent(message);

    // 3️:=> Log intent (required by spec)
    await IntentLog.create({
      sessionId,
      intent,
      confidence: 1.0, // rule-based confidence
    });

    // 4️:=> creating  a lead
    const lead = await getOrCreateLead(sessionId);

    // 5:=> fill lead fields if we have any matching intent
    const leadField = intentToLeadFieldMap[intent];
    if (leadField && !lead[leadField]) {
      await updateLeadField(sessionId, leadField, message);
    }

    // 6:=> decide the bots reply
    let botReply;

    switch (intent) {
      case "COUNTRY_SELECTION":
        botReply = "Great choice  Which course are you planning to study?";
        break;

      case "COURSE_SELECTION":
        botReply = "Nice! What is your highest qualification?";
        break;

      case "FEES_QUERY":
        botReply =
          "Fees depend on country and university. Which country are you interested in?";
        break;

      case "VISA_QUERY":
        botReply =
          "Visa rules vary by country. Which country are you planning to apply to?";
        break;

      case "TEST_REQUIREMENT":
        botReply =
          "Do you already have an English test score like IELTS or PTE?";
        break;

      case "COUNSELOR_REQUEST":
        botReply = "Sure ,I’ll connect you with one of our counselors shortly.";
        break;

      default:
        botReply =
          "Got it! Could you please tell me which country you are interested in?";
    }

    // 7:=> mark lead as qualified
    if (isLeadQualified(lead)) {
      lead.status = "qualified";
      await lead.save();
    }

    // 8️:=> Store bot reply
    await ChatMessage.create({
      sessionId,
      sender: "bot",
      message: botReply,
    });

    // 9:=> return the bots messages;
    return res.status(200).json({
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
