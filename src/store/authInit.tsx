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
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? undefined,
      });
    } else {
      setUser(null);
    }
  }, [session]);

  return null;
}
