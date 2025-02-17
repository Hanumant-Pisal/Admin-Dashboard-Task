import Category from "../models/Category.js";


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addCategory = async (req, res) => {
  try {
    const { name, image, status, sequence } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = new Category({ name, image, status, sequence });
    await category.save();
    res.status(201).json({ message: "Category added successfully", category });

  } catch (error) {
    res.status(500).json({ message: "Failed to add category", error: error.message });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { name, image, status, sequence } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, image, status, sequence }, { new: true });

    res.status(200).json({ message: "Category updated successfully", updatedCategory });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
