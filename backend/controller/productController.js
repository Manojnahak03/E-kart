import { Product } from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const createProduct = async (req, res) => {
  try { const product = await Product.create(req.body); res.status(201).json({ success: true, product }); }
  catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
