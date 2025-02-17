import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    subCategory: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "SubCategory", 
      required: true 
    },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },

    image: { type: String }, 
    status: { type: Boolean, default: true }, 
    sequence: { type: Number, default: 0 }, 
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Product", ProductSchema);
