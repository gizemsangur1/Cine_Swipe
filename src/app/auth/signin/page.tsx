"use client";

import LoginForm from "@/components/LoginForm";

export default function SignInPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginTop: "4rem" }}>
      <LoginForm/>
    </div>
  );
}
