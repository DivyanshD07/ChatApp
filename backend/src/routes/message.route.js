import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";
import { disableCache } from "../middleware/cache.middleware.js";

const router = express.Router();

router.use(disableCache);
router.use(protectRoute);
router.get("/user", getUserForSidebar);
router.get("/messages/:id", getMessages);
router.post("/messages/send/:id", sendMessage);

export default router;