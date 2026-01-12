import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AdminUser from "./admin.model.js";
import Lead from "../leads/lead.model.js";
import EscalationRequest from "../escalation/escalation.model.js";
import ChatMessage from "../chat/chatMessage.model.js";

//SGINUP
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Create admin (password hashing happens automatically)
    const admin = await AdminUser.create({
      name,
      email,
      password,
      role: "admin",
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      token,
    });
  } catch (error) {
    console.error("Admin signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await AdminUser.findOne({ email }).select("+password");

    // 🔐 SAFETY CHECK
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error); // 👈 keep this
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

//getting all leadds
export const getLeads = async (req, res) => {
  try {
    const { country, course, status } = req.query;

    const filter = {};
    if (country) filter.intendedCountry = country;
    if (course) filter.intendedCourse = course;
    if (status) filter.status = status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const getEscalations = async (req, res) => {
  try {
    const escalations = await EscalationRequest.find()
      .populate("leadId")
      .populate("sessionId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: escalations.length,
      escalations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch escalations",
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};
