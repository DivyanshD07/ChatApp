import express from "express"
import { getUserProfile, searchUsers } from "../controllers/user.controller.js";



const router = express.Router();

router.get("/search", searchUsers);
router.get("/profile/:userId", getUserProfile);

export default router;