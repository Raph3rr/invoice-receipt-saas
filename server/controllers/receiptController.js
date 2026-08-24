import Receipt from "../models/Receipt.js";
import Sale from "../models/Sale.js";
import Business from "../models/Business.js";

// GET /api/receipts  (protected) — list receipts for the logged-in business
export const getReceipts = async (req, res) => {
  try {
    if (!req.user.businessId) {
      return res.status(400).json({ success: false, message: "Set up your business first" });
    }
    const receipts = await Receipt.find({ businessId: req.user.businessId })
      .populate("saleId")
      .sort({ createdAt: -1 });
    res.json({ success: true, receipts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/receipts/:id  (protected) — owner's detailed view
export const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ _id: req.params.id, businessId: req.user.businessId }).populate("saleId");
    if (!receipt) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }
    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/receipts/public/:token  (PUBLIC — no auth) — what a customer sees when you share the link
export const getPublicReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ token: req.params.token });
    if (!receipt) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    const sale = await Sale.findById(receipt.saleId);
    const business = await Business.findById(receipt.businessId).select(
      "name logo phone email address city state receiptSettings"
    );

    if (!sale || !business) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    res.json({
      success: true,
      receipt: {
        createdAt: receipt.createdAt,
        business,
        sale: {
          customerName: sale.customerName,
          items: sale.items,
          total: sale.total,
          createdAt: sale.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
