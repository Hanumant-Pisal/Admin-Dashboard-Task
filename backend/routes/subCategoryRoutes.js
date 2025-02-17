
import express from "express";
import { getSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from "../controllers/subCategoryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all sub-categories
router.get("/", protect, getSubCategories);

// Add a new sub-category
router.post("/", protect, addSubCategory);

// Update a sub-category
router.put("/:id", protect, updateSubCategory);

// Delete a sub-category
router.delete("/:id", protect, deleteSubCategory);

export default router;
