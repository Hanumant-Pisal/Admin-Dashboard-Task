import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    status: { type: Boolean, default: true },
    sequence: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
