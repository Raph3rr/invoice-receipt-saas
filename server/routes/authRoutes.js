import { Router } from "express";
import { registerUser, loginUser, getMe, logoutUser, updateProfile, changePassword } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);
router.put("/me", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;
