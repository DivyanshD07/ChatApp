import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriends, getFriendsRequests, respondToFriendRequest, sendFriendRequest } from "../controllers/friends.controller.js";
import { disableCache } from "../middleware/cache.middleware.js";
 
const router = express.Router();

router.use(disableCache);
router.use(protectRoute);
router.post("/send-request/:receiverId", sendFriendRequest);
router.post("/respond/:requestId", respondToFriendRequest);
router.get("/friends-list", getFriends); 
router.get("/friend-requests", getFriendsRequests);

export default router;