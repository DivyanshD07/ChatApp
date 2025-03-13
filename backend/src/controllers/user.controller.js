import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("_id userName email profileImage");

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in search users:", error.message);
        res.status(500).json({ error: "Internal Server error " });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const {userId} = req.params;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};