import User from "../models/user.model.js";

// Send friend request
export const sendFriendRequest = async (req, res) => {
    const senderId = req.user._id
    const { receiverId } = req.params;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender) return res.status(400).json({ message: "Sender not found " })
        if (!receiver) return res.status(404).json({ message: "Receiver not found" });

        // check if already friends
        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({ message: "Already friends" });
        }

        // check if a request is already sent
        const requestExists = receiver.friendRequests.some(
            (req) => req.from.toString() === senderId
        );
        if (requestExists) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Add friend request to receiver's list
        receiver.friendRequests.push({
            from: senderId,
            status: "pending"
        });

        await receiver.save();
        res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        console.log("Error in sendFriendRequest : ", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const respondToFriendRequest = async (req, res) => {
    const userId = req.user._id;
    const { requestId } = req.params;
    const { action } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find the request
        const request = user.friendRequests.find((r) => r.from.toString() === requestId);
        if (!request) return res.status(404).json({ message: "Friend request not found" });

        if (action === "accept") {
            user.friends.push(requestId);
            const sender = await User.findById(requestId);
            if (!sender) return res.status(404).json({ message: "Sender not found" });

            sender.friends.push(userId);
            await sender.save();
        }

        // Remove request from the list
        user.friendRequests = user.friendRequests.filter((r) => r.from.toString() !== requestId);
        await user.save();

        res.status(200).json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
        console.log("Error in respondToFriendRequest:", error.message);
        res.status(500).json({ message: error.message });
    }
}

// Get Friends list
export const getFriends = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const user = await User.findById(loggedInUserId).populate("friends", "userName fullName email");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getFriends: ", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}


export const getFriendsRequests = async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const user = await User.findById(loggedInUserId).populate("friendRequests", "userName fullName email");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user.friendRequests);
    } catch (error) {
        console.log("Error in getFriends: ", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}