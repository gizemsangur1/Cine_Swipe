"use client";

import { Button, Col, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import SearchBar from "./SearchBar";
import { account, databases } from "@/lib/appwrite";

export default function AuthButtons() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = await account.get();

        const userDoc = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
          authUser.$id
        );

        setUser({
          id: userDoc.$id,
          email: authUser.email,
          name: userDoc.name || "",
          surname: userDoc.surname || "",
          username: userDoc.username || "",
          avatar_url: userDoc.avatar_url || "",
        });
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  if (user) {
    return (
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          alignItems: "center",
        }}
        gutter={4}
      >
        <Col span={4}>
          <Link href="/">
            <Typography style={{ fontSize: "36px", fontWeight: "bold" }}>
              CineSwipe
            </Typography>
          </Link>
        </Col>
        <Col span={10}>
          <SearchBar />
        </Col>
        <Col span={2} style={{ display: "flex", justifyContent: "end" }}>
          <Link href="/profile">
            <div
              style={{
                width: "90px",
                height: "90px",
                backgroundColor: "#ddd",
                borderRadius: "50%",
                backgroundImage: user?.avatar_url
                  ? `url(${user.avatar_url})`
                  : "none",
                backgroundSize: "cover",
              }}
            ></div>
          </Link>
          <Button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Logout
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Row
      style={{ display: "flex", justifyContent: "end", padding: "10px" }}
      gutter={4}
    >
      <Col span={2}>
        <Button
          style={{ width: "100%" }}
          onClick={() => router.push("/auth/signin")}
        >
          Login
        </Button>
      </Col>
      <Col span={2}>
        <Button
          style={{ width: "100%" }}
          onClick={() => router.push("/auth/register")}
        >
          Register
        </Button>
      </Col>
    </Row>
  );
}
