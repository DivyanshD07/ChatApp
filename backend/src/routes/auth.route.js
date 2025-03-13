import express from "express";
import { checkAuth, login, logout, resendVerificationEmail, signup, updateProfile, verifyEmail } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { disableCache } from "../middleware/cache.middleware.js";

const router = express.Router();

router.use(disableCache);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
// Protected Routes
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth)

export default router