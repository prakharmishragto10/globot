import express from "express";
import { adminLogin, adminSignup } from "./admin.controller.js";
import { adminJWTAuth } from "./admin.jwt.middleware.js";
import {
  getLeads,
  getEscalations,
  getConversation,
} from "./admin.controller.js";

const router = express.Router();

// Public
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// Protected
router.use(adminJWTAuth);

router.get("/leads", getLeads);
router.get("/escalations", getEscalations);
router.get("/conversation/:sessionId", getConversation);

export default router;
