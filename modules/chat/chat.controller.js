import ChatSession from "./chat.model.js";
import ChatMessage from "./chatMessage.model.js";
import { detectIntent } from "./intentDetector.js";
import IntentLog from "./intentLog.model.js";

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

    // Store user message
    await ChatMessage.create({
      sessionId,
      sender: "user",
      message,
    });

    //static bot reply;
    const botReply =
      "Got it , i will connect you with our top rated counsellor";

    //store bot's reply
    await ChatMessage.create({
      sessionId,
      sender: "bot",
      message: botReply,
    });

    return res.status(200).json({
      success: true,
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
