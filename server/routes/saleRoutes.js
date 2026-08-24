import { Router } from "express";
import { createSale, getSales, getSale } from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getSales);
router.post("/", createSale);
router.get("/:id", getSale);

export default router;
