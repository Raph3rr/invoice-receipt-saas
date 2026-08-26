import Business from "../models/Business.js";
import Product from "../models/Product.js";

// GET /api/storefront/:slug — PUBLIC, no auth. Returns branding + product catalog
// so a customer can browse a business's products without logging in.
export const getStorefront = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug }).select(
      "name slug logo description category phone email address city state storefrontEnabled"
    );

    if (!business || !business.storefrontEnabled) {
      return res.status(404).json({ success: false, message: "This storefront is not available" });
    }

    const products = await Product.find({ businessId: business._id }).select(
      "name price quantity category image"
    );

    res.json({ success: true, business, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
