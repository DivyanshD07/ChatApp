import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";


export const useUserStore = create((set) => ({

    isSearchingForUser: false,
    searchedUsers: [],
    isLoadingUserProfile: false,
    userProfile: null,

    searchUser: async (query) => {
        set({ isSearchingForUser: true });
        try {
            const res = await axiosInstance.get(`/users/search?query=${query}`);
            set({ searchedUsers: res.data });
        } catch (error) {
            console.error("Error fetching users: ", error);
        } finally {
            set({ isSearchingForUser: false });
        }
    },
    clearUsers: () => set({ searchedUsers: [] }),

    getUserProfile: async (userId) => {
        console.log("Fetching profile for userId:", userId)
        set({ isLoadingUserProfile: true });
        try {
            const res = await axiosInstance.get(`/users/profile/${userId}`);
            set({ userProfile: res.data });
        } catch (error) {
            console.error("Error getting user profile: ", error);
        } finally {
            set({ isLoadingUserProfile: false });
        }
    } 
}));

