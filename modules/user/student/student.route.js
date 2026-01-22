// student.routes.js
import express from "express";
import { studentSignup, studentLogin } from "./student.controller.js";

const router = express.Router();

router.post("/signup", studentSignup);
router.post("/login", studentLogin);

export default router;
