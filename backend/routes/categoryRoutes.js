import express from "express";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all categories (Public)
router.get("/", getCategories);

// Add a new category (Protected)
router.post("/", protect, addCategory);

// Update a category (Protected)
router.put("/:id", protect, updateCategory);

// Delete a category (Protected)
router.delete("/:id", protect, deleteCategory);

export default router;
