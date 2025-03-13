import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";

export const useFriendStore = create((set) => ({
    friends: [],
    friendRequests: [],
    isFriendsListLoading: false,
    isSendingFriendRequest: false,
    isFetchingFriendRequests: false,

    // fetch friends list
    fetchFriends: async () => {
        set({ isFriendsListLoading: true });
        try {
            const response = await axiosInstance.get("/friends/friends-list");
            console.log("friends: ", response.data);
            set({ friends: response.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFriendsListLoading: false });
        }
    },

    // fetch friend request
    fetchFriendRequests: async () => {
        set({ isFetchingFriendRequests: true });
        try {
            const response = await axiosInstance.get("/friends/friend-requests");
            console.log("friend requests: ", response.data);
            set({ friendRequests: response.data });
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        } finally {
            set({ isFetchingFriendRequests: false });
        }
    },

    // send friend request
    sendFriendRequest: async (receiverId) => {
        set({ isSendingFriendRequest: true });
        try {
            const res = await axiosInstance.post(`/friends/send-request/${receiverId}`);
            toast.success("Friend request send");
        } catch (error) {
            console.error("Error sending friend request", error);
            if(error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                if(errorMessage === "Friend request already sent") {
                    toast.error("Friend request already sent");
                } else if (errorMessage === "Already friends") {
                    toast.error("You are already friends");
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error("Something went wrong. Please try again.");
            } 
        } finally {
            set({ isSendingFriendRequest: false });
        }
    },

    // respond to request
    respondToRequest: async (requestId, action) => {
        try {
            await axiosInstance.post(`/friends/respond/${requestId}`, { action });

            set((state) => ({
                friendRequests: state.friendRequests.filter((req) => req.from !== requestId),
            }))
        } catch (error) {
            console.error(`Error ${action}ing friend request: `, error);
        }
    },
}));