import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    
    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (error) {
    console.error("Error in register:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

   
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(" Error in login:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newToken = generateToken(decoded.id);
    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    console.error("Error in refresh token:", error.message);
    res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};
