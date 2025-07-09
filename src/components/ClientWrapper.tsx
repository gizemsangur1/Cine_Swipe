"use client";

import AuthInit from "@/store/authInit";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function ClientWrapper({ children }: Props) {
  return (
    <SessionProvider>
      <AuthInit />
      {children}
    </SessionProvider>
  );
}
