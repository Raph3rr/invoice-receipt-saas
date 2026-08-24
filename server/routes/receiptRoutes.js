import { Router } from "express";
import { getReceipts, getReceipt, getPublicReceipt } from "../controllers/receiptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public route must come first and stay unprotected — no auth check here on purpose.
router.get("/public/:token", getPublicReceipt);

router.get("/", protect, getReceipts);
router.get("/:id", protect, getReceipt);

export default router;
