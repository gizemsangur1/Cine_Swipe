"use client";
import { useUserStore } from "@/store/useUserStore";
import { Button, Col, Row, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./page.module.css";
import supabase from "@/utils/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        setUser({ ...data.user.user_metadata, ...profile });
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
            backgroundColor: "blue",
            borderRadius: "50%",
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
          <Link className={styles.link} href="#">
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
