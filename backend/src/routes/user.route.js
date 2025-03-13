import express from "express"
import { getUserProfile, searchUsers } from "../controllers/user.controller.js";
import { enableCache } from "../middleware/cache.middleware.js";



const router = express.Router();

router.get("/search", searchUsers);
router.get("/profile/:userId",enableCache(600), getUserProfile);

export default router;