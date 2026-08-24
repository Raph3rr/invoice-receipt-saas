import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import Business from "../models/Business.js";

const requireBusiness = (req, res) => {
  if (!req.user.businessId) {
    res.status(400).json({ success: false, message: "Please finish setting up your business before creating invoices." });
    return null;
  }
  return req.user.businessId;
};

// POST /api/invoices
// Body: { customerName, customerEmail?, customerPhone?, dueDate, notes?, items: [{ productId?, name?, price?, quantity }] }
// Items can reference an existing product (price snapshot pulled automatically) OR be a free-text line (custom name + price).
export const createInvoice = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const { customerName, customerEmail, customerPhone, dueDate, notes, items } = req.body;

    if (!customerName || !dueDate) {
      return res.status(400).json({ success: false, message: "Customer name and due date are required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "At least one item is required" });
    }

    const resolvedItems = [];
    for (const item of items) {
      let { productId, name, price, quantity } = item;
      quantity = Number(quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({ success: false, message: "Each item needs a quantity of at least 1" });
      }

      if (productId) {
        // Pull the current name/price from the product catalog — but note, unlike a Sale,
        // this does NOT check or reduce stock. Nothing has been fulfilled yet.
        const product = await Product.findOne({ _id: productId, businessId });
        if (!product) {
          return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
        }
        name = product.name;
        price = product.price;
      } else {
        // Free-text line item (e.g. a service, not from the product catalog)
        if (!name || price === undefined) {
          return res.status(400).json({ success: false, message: "Custom items need a name and price" });
        }
        price = Number(price);
      }

      resolvedItems.push({
        productId: productId || null,
        name,
        price,
        quantity,
        subtotal: price * quantity,
      });
    }

    const total = resolvedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const invoice = await Invoice.create({
      businessId,
      customerName,
      customerEmail,
      customerPhone,
      items: resolvedItems,
      total,
      dueDate,
      notes,
    });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices
export const getInvoices = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const invoices = await Invoice.find({ businessId }).sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/:id
export const getInvoice = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const invoice = await Invoice.findOne({ _id: req.params.id, businessId });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/invoices/:id/payment — mark an invoice as paid
export const markInvoicePaid = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, businessId },
      { status: "paid" },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, businessId });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/public/:token — PUBLIC, no auth — what the customer sees
export const getPublicInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ token: req.params.token });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    const business = await Business.findById(invoice.businessId).select(
      "name logo phone email address city state receiptSettings"
    );
    if (!business) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    // Compute overdue status on the fly rather than storing it — "overdue" is just
    // "unpaid + due date has passed", not a separate state to keep in sync.
    const isOverdue = invoice.status === "unpaid" && new Date(invoice.dueDate) < new Date();

    res.json({
      success: true,
      invoice: {
        business,
        customerName: invoice.customerName,
        items: invoice.items,
        total: invoice.total,
        dueDate: invoice.dueDate,
        status: invoice.status,
        isOverdue,
        notes: invoice.notes,
        createdAt: invoice.createdAt,
        token: invoice.token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
