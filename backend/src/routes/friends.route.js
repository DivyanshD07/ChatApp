import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriends, respondToFriendRequest, sendFriendRequest } from "../controllers/friends.controller.js";

const router = express.Router();

router.use(protectRoute);
router.post("/send/:receiverId", sendFriendRequest);
router.post("/respond/:requestId", respondToFriendRequest);
router.get("/friends-list", getFriends); 

export default router;