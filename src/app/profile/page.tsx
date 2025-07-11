"use client"
import { Button, Col } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProfilePage() {
	  const router = useRouter();
	
  return (
    <div>
      <Col span={2}>
        <Button
          style={{ width: "100%" }}
          onClick={() => router.push("/watchlist")}
        >
          Watch List
        </Button>
      </Col>
    </div>
  );
}
