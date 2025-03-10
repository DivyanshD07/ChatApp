import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
import crypto from "crypto"
import { sendVerificationEmail } from "../lib/emailService.js";

export const signup = async (req, res) => {
    const { email, fullName, userName, password } = req.body;

    try {

        if (!email || !fullName || !userName || !password) {
            return res.status(400).json({ message: "Fill the mandatory fields" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters" });
        }

        const userEmail = await User.findOne({ email });
        const userUserName = await User.findOne({ userName });
        if (userEmail) return res.status(400).json({ message: "Email already exists" });
        if (userUserName) return res.status(400).json({ message: "username already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            fullName,
            email,
            userName,
            password: hashedPassword,
            verificationToken,
        })
        await newUser.save();

        await sendVerificationEmail(email, verificationToken);
        res.json({ message: 'Signup successful! Please check your email to verify your account.' })

        // if (newUser) {
        //     // generate jwt token here
        //     generateToken(newUser._id, res);
        //     await newUser.save();

        //     res.status(201).json({
        //         _id: newUser._id,
        //         fullName: newUser.fullName,
        //         email: newUser.email,
        //         profilePic: newUser.profilePic,
        //     })
        // } else {
        //     res.status(400).json({ message: "Invalid user data" });
        // }
    } catch (error) {
        console.log("Error in signup controller : ", error);
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or ecpired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
}

export const login = async (req, res) => {
    // console.log("Login request received:", req.body);
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All the fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.isVerified) return res.status(400).json({ message: 'Email not verified. Check your inbox.' })

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            isVerified: user.isVerified
        })
    } catch (error) {
        console.log("Error in login credentials: ", error.message);
        res.status(500).json({ message: "Internal Server Error " });
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        await sendVerificationEmail(user.email, user.verificationToken);
        
    } catch (error) {
        console.error("Error resending verification email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout container:", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile :", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}