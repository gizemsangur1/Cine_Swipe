"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "./useUserStore";

export default function AuthInit() {
  const { data: session } = useSession();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (session?.user) {
      setUser({
        email: session.user.email ?? "",
      });
    } else {
      setUser(null);
    }
  }, [session]);

  return null;
}
