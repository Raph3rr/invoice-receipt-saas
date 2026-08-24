import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL — Cloudinary upload wired up in a later phase
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
