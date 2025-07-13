"use client";
import { Button, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function AuthButtons() {
  const router = useRouter();
const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const authUser = data.user;

        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name,
          surname: authUser.user_metadata?.surname,
          username: authUser.user_metadata?.username,
          avatar_url: authUser.user_metadata?.avatar_url || "", 
        });
      } else if (error) {
        console.error("Failed to fetch user", error.message);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser]);

  if (user)
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
        <Col span={2} style={{ display: "flex", justifyContent: "end" }}>
          <Link href="/profile">
            <div
              style={{
                width: "90px",
                height: "90px",
                backgroundColor: "#ddd",
                borderRadius: "50%",
                backgroundImage: `url(${user?.avatar_url})`,
                backgroundSize: "cover",
              }}
            ></div>
          </Link>
        </Col>
      </Row>
    );

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
