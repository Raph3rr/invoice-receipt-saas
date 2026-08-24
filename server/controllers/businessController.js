import Business from "../models/Business.js";
import User from "../models/User.js";
import { slugify } from "../utils/slugify.js";

// POST /api/business  (protected) — create the business during onboarding
export const createBusiness = async (req, res) => {
  try {
    const existing = await Business.findOne({ ownerId: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: "Business already set up for this account" });
    }

    const { name, category, description, phone, email, address, city, state, footerMessage } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Business name is required" });
    }

    // Build a unique slug — if "my-shop" is taken, try "my-shop-2", "my-shop-3", etc.
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 2;
    while (await Business.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const business = await Business.create({
      ownerId: req.user._id,
      name,
      slug,
      category,
      description,
      phone,
      email,
      address,
      city,
      state,
      receiptSettings: { footerMessage: footerMessage || "" },
    });

    // Link the business back to the user
    await User.findByIdAndUpdate(req.user._id, { businessId: business._id });

    res.status(201).json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/business  (protected) — get the current user's business
export const getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: "No business found for this account" });
    }
    res.json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/business  (protected)
export const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate({ ownerId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!business) {
      return res.status(404).json({ success: false, message: "No business found for this account" });
    }
    res.json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/business/public/:slug — public receipt-facing info only
export const getPublicBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug }).select(
      "name logo phone email address city state receiptSettings"
    );
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
