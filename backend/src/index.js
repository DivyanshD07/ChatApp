import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendRoutes from "./routes/friends.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser()); // Allows us to parse cookie
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({ limit: "5mb", extended: true }))


app.get("/", (req, res) => {
    res.send("Api is running...")
})

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/friends", friendRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})