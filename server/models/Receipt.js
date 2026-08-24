import mongoose from "mongoose";
import crypto from "crypto";

const ReceiptSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },
    // The public, hard-to-guess link segment — e.g. /receipt/<token>
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(12).toString("hex"),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Receipt", ReceiptSchema);
