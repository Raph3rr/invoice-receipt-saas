import mongoose from "mongoose";
import crypto from "crypto";

const InvoiceItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true },
    items: {
      type: [InvoiceItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    total: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["unpaid", "paid", "cancelled"],
      default: "unpaid",
    },
    notes: { type: String, trim: true },
    // Public, hard-to-guess link segment — same pattern as Receipt
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(12).toString("hex"),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", InvoiceSchema);
