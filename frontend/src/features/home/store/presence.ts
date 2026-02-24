import { create } from "zustand";

type presencestore = {
  onlineUsers: Record<string, boolean>;
};

type actions = {
  setPresence: (userId: string, isOnline: boolean) => void;
};

export const usePresenceStore = create<presencestore & actions>((set) => ({
  onlineUsers: {},
  setPresence: (userId, isOnline) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: isOnline },
    })),
}));
