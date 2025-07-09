"use client";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

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
        style={{ display: "flex", justifyContent: "end", padding: "10px" }}
        gutter={4}
      >
        <Col span={2}>
          <Button
            style={{ width: "100%" }}
            onClick={() => router.push("/auth/signin")}
          >
            WatchList
          </Button>
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
