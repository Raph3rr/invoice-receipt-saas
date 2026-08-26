import { Router } from "express";
import { getStorefront } from "../controllers/storefrontController.js";

const router = Router();

// Entirely public — no protect middleware anywhere on this router.
router.get("/:slug", getStorefront);

export default router;
