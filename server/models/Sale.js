import mongoose from "mongoose";

// Embedded line-item — lives inside the Sale document, not a separate collection.
// See the explanation in chat: sale items are always read/written together with their sale.
const SaleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot of the product name at time of sale
    price: { type: Number, required: true }, // snapshot of the price at time of sale
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const SaleSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: "Walk-in customer",
    },
    items: {
      type: [SaleItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", SaleSchema);
