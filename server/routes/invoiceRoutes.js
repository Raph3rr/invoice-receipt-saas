import { Router } from "express";
import {
  createInvoice,
  getInvoices,
  getInvoice,
  markInvoicePaid,
  getPublicInvoice,
} from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public route stays unprotected, listed first
router.get("/public/:token", getPublicInvoice);

router.use(protect);
router.get("/", getInvoices);
router.post("/", createInvoice);
router.get("/:id", getInvoice);
router.post("/:id/payment", markInvoicePaid);

export default router;
