"use client"
import { create } from "zustand";

type User = {
  name: string;
  email: string;
  image?: string;
};

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
