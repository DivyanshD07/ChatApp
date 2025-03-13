import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            if (response.data) {
                set({ authUser: response.data });

                if (response.data.isVerified) {
                    get().connectSocket();
                } else {
                    toast.error("Please verify your email first.");
                }
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            // set({ authUser: response.data });
            toast.success("Account created successfully. Please check your email for verification.");
            // get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    resendVerificationEmail: async (email) => {
        try {
            await axiosInstance.post("/auth/resend-verification", { email });
            toast.success("Verification email send!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resent email.");
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();

            window.location.href = "/login";
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({ authUser: response.data });
            toast.success("Logged in successfully.");
            get().connectSocket();
        } catch (error) {
            if (error.response?.data?.message === "Email not verified") {
                toast.error("Email not verified. Please check your inbox.");
            } else {
                toast.error(error.response?.data?.message || "Login failed");
            }
            throw new Error(error.response?.data?.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: response.data });
            toast.success("Profile picture uploaded");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occured");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || !authUser.isVerified || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}));