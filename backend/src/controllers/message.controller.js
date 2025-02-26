import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getUserForSidebar: ", error.message);
        req.status(500).json({ error: "Internal Server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages: ", error.message);
        req.status(500).json({ error: "Internal Server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const myId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // Realtime messaging
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage: ", error.message);
        req.status(500).json({ error: "Internal Server error" });
    }
}