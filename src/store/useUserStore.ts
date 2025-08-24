"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id?: string;
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  token?: string;
  avatar_url?: string;
};

interface UserStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true, 
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "user-storage", 
      partialize: (state) => ({ user: state.user }), 
    }
  )
);
