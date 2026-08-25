import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";
import Invoice from "../models/Invoice.js";

const requireBusiness = (req, res) => {
  if (!req.user.businessId) {
    res.status(400).json({ success: false, message: "Please finish setting up your business before adding customers." });
    return null;
  }
  return req.user.businessId;
};

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const { name, phone, email, address } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Customer name is required" });
    }

    const customer = await Customer.create({ businessId, name, phone, email, address });
    res.status(201).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const customers = await Customer.find({ businessId }).sort({ name: 1 });
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/:id — includes purchase history (sales + invoices)
export const getCustomer = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const customer = await Customer.findOne({ _id: req.params.id, businessId });
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const [sales, invoices] = await Promise.all([
      Sale.find({ businessId, customerId: customer._id }).sort({ createdAt: -1 }),
      Invoice.find({ businessId, customerId: customer._id }).sort({ createdAt: -1 }),
    ]);

    res.json({ success: true, customer, sales, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const customer = await Customer.findOneAndUpdate({ _id: req.params.id, businessId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const businessId = requireBusiness(req, res);
    if (!businessId) return;

    const customer = await Customer.findOneAndDelete({ _id: req.params.id, businessId });
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
