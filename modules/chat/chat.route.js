import express from "express";
import { startChat, endChat, sendMessage } from "./chat.controller.js";

const router = express.Router();

// Start a new chat session
router.post("/start", startChat);

// Send a message
router.post("/message", sendMessage);

// End a chat session
router.post("/end", endChat);

export default router;
