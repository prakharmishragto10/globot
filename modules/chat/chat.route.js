import express from "express";
import { startChat, endChat } from "./chat.controller.js";

const router = express.Router();

//post a new session
router.post("/start", startChat);

//remove an existing session
router.post("/end", endChat);

export default router;
