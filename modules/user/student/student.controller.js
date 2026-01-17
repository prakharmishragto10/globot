// student.controller.js
import jwt from "jsonwebtoken";
import Student from "./student.model.js";

//signup an student;
export const studentSignup = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Student already exists",
      });
    }

    const student = await Student.create({
      fullName,
      email,
      phone,
      password,
    });

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

//login an existing user
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select("+password");
    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid login" });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid login" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
