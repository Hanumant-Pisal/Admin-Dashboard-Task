import express from "express";
import { register, login, refreshToken } from "../controllers/authController.js";

const router = express.Router();

// User Registration
router.post("/register", register);

// User Login
router.post("/login", login);

// Refresh Token (Optional)
router.post("/refresh-token", refreshToken);

export default router;
