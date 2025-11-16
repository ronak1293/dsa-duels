import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

// ------------------- SIGNUP -------------------
router.post("/signup", async (req, res) => {
  try {
    const { email, password, handle } = req.body;
    console.log("Signup body:", req.body);

    if (!email || !password || !handle) {
      return res.status(400).json({ message: "Email, password, and handle are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: "Email already registered" });

    const existingHandle = await User.findOne({ handle });
    if (existingHandle) return res.status(409).json({ message: "Handle already taken" });

    // ❌ remove manual bcrypt.hash() — model pre-save hook will do it
    const user = await User.create({
      email,
      password,
      handle,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        handle: user.handle,
        email: user.email,
        rating: user.rating,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        handle: user.handle,
        email: user.email,
        rating: user.rating,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;


//YWNW2ihGP0RQWa16gqdW9Jw7NJ7Iw1ljnW9wzswjAKk