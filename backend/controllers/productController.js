import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    .populate("category", "name")
      .populate("subCategory", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addProduct = async (req, res) => {
  try {
    const { name, subCategory, category, image, status, sequence } = req.body;

    
    if (!isValidObjectId(subCategory)) {
      return res.status(400).json({ message: "Invalid subCategory ID" });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

  
    const subCategoryExists = await SubCategory.findById(subCategory);
    if (!subCategoryExists) {
      return res.status(400).json({ message: "Subcategory does not exist" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    
    const product = new Product({
      name,
      subCategory,
      category,
      image: image || "default-image-url",  
      status,
      sequence
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { name, subCategory, category, image, status, sequence } = req.body;
    const productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, subCategory, category, image, status, sequence },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
