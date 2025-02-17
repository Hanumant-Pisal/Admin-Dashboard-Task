import SubCategory from "../models/SubCategory.js";


export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category", "name");
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addSubCategory = async (req, res) => {
  try {
    const { name, category, image, status, sequence } = req.body;
    const subCategory = new SubCategory({ name, category, image, status, sequence });

    await subCategory.save();
    res.status(201).json({ message: "Sub-Category added successfully", subCategory });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateSubCategory = async (req, res) => {
  try {
    const { name, category, image, status, sequence } = req.body;
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, { name, category, image, status, sequence }, { new: true });

    res.status(200).json({ message: "Sub-Category updated successfully", updatedSubCategory });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sub-Category deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
