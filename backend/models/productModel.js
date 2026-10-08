import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, default: "General", trim: true },
  image: { type: String, default: "" },
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
