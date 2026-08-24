import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Receipt from "../models/Receipt.js";

const requireBusiness = (req, res) => {
  if (!req.user.businessId) {
    res.status(400).json({
      success: false,
      message: "Please finish setting up your business before recording sales.",
    });
    return null;
  }
  return req.user.businessId;
};

// POST /api/sales
// Body: { customerName?, items: [{ productId, quantity }] }
export const createSale = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const { customerName, items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "At least one item is required" });
    }

    // Look up every product first and validate stock BEFORE saving anything,
    // so we never end up half-charging for a sale that partly fails.
    const resolvedItems = [];
    for (const { productId, quantity } of items) {
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ success: false, message: "Each item needs a productId and a quantity of at least 1" });
      }

      const product = await Product.findOne({ _id: productId, businessId });
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
      }
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${product.name}" — only ${product.quantity} left`,
        });
      }

      resolvedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    const total = resolvedItems.reduce((sum, item) => sum + item.subtotal, 0);

    // All validated — now actually deduct stock and save the sale.
    for (const item of resolvedItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
    }

    const sale = await Sale.create({
      businessId,
      customerName: customerName || "Walk-in customer",
      items: resolvedItems,
      total,
    });

    // Every sale automatically gets a receipt with a shareable public link.
    const receipt = await Receipt.create({ businessId, saleId: sale._id });

    res.status(201).json({ success: true, sale, receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sales
export const getSales = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const sales = await Sale.find({ businessId }).sort({ createdAt: -1 });
    res.json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sales/:id
export const getSale = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const sale = await Sale.findOne({ _id: req.params.id, businessId });
    if (!sale) {
      return res.status(404).json({ success: false, message: "Sale not found" });
    }
    res.json({ success: true, sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
