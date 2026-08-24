import { Router } from "express";
import { createBusiness, getBusiness, updateBusiness, getPublicBusiness } from "../controllers/businessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createBusiness);
router.get("/", protect, getBusiness);
router.put("/", protect, updateBusiness);
router.get("/public/:slug", getPublicBusiness); // public — no auth required

export default router;
