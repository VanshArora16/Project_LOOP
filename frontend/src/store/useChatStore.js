import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            const incomingMessages = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.messages)
                ? res.data.messages
                : [];
            set({ messages: incomingMessages });
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser } = get();
        const currentMessages = Array.isArray(get().messages)
            ? get().messages
            : [];
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );
            if (!selectedUser?._id) {
                toast.error("No user selected");
                return;
            }
            set({ messages: [...currentMessages, res.data] });
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );  
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        // todo: optimize this later
        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    // todo: optimize this later
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
