import Product from "../models/Product.js";

// Small helper: every product route needs the user's businessId.
// If they haven't finished onboarding yet, there's nothing to scope products to.
const requireBusiness = (req, res) => {
  if (!req.user.businessId) {
    res.status(400).json({
      success: false,
      message: "Please finish setting up your business before adding products.",
    });
    return null;
  }
  return req.user.businessId;
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const { name, price, quantity, category, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: "Product name and price are required" });
    }

    const product = await Product.create({
      businessId,
      name,
      price,
      quantity: quantity || 0,
      category,
      image,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const products = await Product.find({ businessId }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const product = await Product.findOne({ _id: req.params.id, businessId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, businessId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const product = await Product.findOneAndDelete({ _id: req.params.id, businessId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
