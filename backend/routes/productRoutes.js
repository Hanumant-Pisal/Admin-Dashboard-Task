import express from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js"; // Assuming you have a JWT protect middleware

const router = express.Router();

// Get all products
router.get("/", protect, getProducts);

// Add a new product
router.post("/", protect, addProduct);

// Update a product
router.put("/:id", protect, updateProduct);

// Delete a product
router.delete("/:id", protect, deleteProduct);

export default router;
