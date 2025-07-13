"use client"
import { create } from "zustand";

type User = {
  id?:string;
  name?:string;
  surname?:string;
  username?:string;
  email?: string;
  token?:string;
  avatar_url?:string;
};

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
