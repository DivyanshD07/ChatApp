import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

export const useFriendStore = create((set) => ({
    friends: [],
    friendRequests: [],
    isFriendsLoading: false,
    isFriendRequestLoading: false,

    // fetch friends list
    fetchFriends: async() => {
        set({ isFriendsLoading: true });
        try {
            const response = await axiosInstance.get("/friends/friends-list");
            set({ friends: response.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFriendsLoading: false });
        }
    },

    // fetch friend request
    fetchFriendRequest: async() => {

    },

    // send friend request
    friendRequestSend: async() => {

    },

    // respond to request
    respondToRequest: async() => {

    },
}))