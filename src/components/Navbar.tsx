"use client";
import { Button, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
      }
    };

    fetchSession();
  }, []);

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
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "blue",
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
