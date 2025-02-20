import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute);
router.get("/user", getUserForSidebar);
router.get("/messages/:id", getMessages);

export default router;