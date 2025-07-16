"use client";

import { useUserStore } from "@/store/useUserStore";
import {  Col, Row, Typography } from "antd";
import Link from "next/link";
import React, { useEffect } from "react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
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
  console.log(user)

  return (
    <Row style={{ width: "100%", padding: "25px" }}>
      <Row style={{ alignItems: "center", width: "100%" }}>
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "#ddd",
            borderRadius: "50%",
            backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : "none",
            backgroundSize: "cover",
          }}
        ></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "25px",
          }}
        >
          <Typography style={{ fontSize: "24px", fontWeight: "bold" }}>
            @{user?.username}
          </Typography>
          <Typography style={{ fontSize: "16px" }}>
            {user?.name} {user?.surname}
          </Typography>
        </div>
      </Row>

      <Row style={{ width: "100%", marginTop: "25px" }}>
        <Col className={styles.linkcol} span={4}>
          <Link className={styles.link} href="/watchlist">
            Watch List
          </Link>
        </Col>
        <Col className={styles.linkcol} span={4}>
          <Link className={styles.link} href="/watched">
            Watched Movies
          </Link>
        </Col>
        <Col className={styles.linkcol} span={4}>
          <Link className={styles.link} href="/settings">
            Profile Settings
          </Link>
        </Col>
      </Row>
    </Row>
  );
}
