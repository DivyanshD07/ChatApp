import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        profilePic: {
            type: String,
            default: "",
        },
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        friendRequests: [{
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending",
            },
        }],
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;