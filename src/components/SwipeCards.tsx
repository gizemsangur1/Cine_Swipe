"use client";
import { Typography } from "antd";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import type { StaticImageData } from "next/image";

interface SwipeCardProps {
  onSwipe: (direction: "left" | "right") => void;
  image: StaticImageData;
  title: string;
  description: string;
  imdb: number;
}

export default function SwipeCard({
  onSwipe,
  image,
  title,
  description,
  imdb,
}: SwipeCardProps) {
  const nodeRef = useRef(null);
  const [isFlying, setIsFlying] = useState(false);
  const [flyDirection, setFlyDirection] = useState<"left" | "right" | null>(null);
  const [xOffset, setXOffset] = useState(0);

  const handleDrag = (_: any, data: any) => {
    setXOffset(data.x);
  };

  const handleStop = (_: any, data: any) => {
    if (data.x > 120) {
      setFlyDirection("right");
      setIsFlying(true);
      setTimeout(() => onSwipe("right"), 300);
    } else if (data.x < -120) {
      setFlyDirection("left");
      setIsFlying(true);
      setTimeout(() => onSwipe("left"), 300);
    } else {
      setXOffset(0);
    }
  };

  const getTransformStyle = () => {
    if (isFlying && flyDirection) {
      const flyX = flyDirection === "right" ? 1000 : -1000;
      const angle = flyDirection === "right" ? 45 : -45;
      return {
        transform: `translateX(${flyX}px) rotate(${angle}deg)`,
        transition: "transform 0.4s ease-out",
        opacity: 0,
      };
    } else {
      return {
        transform: `translateX(${xOffset}px) rotate(${xOffset / 10}deg)`,
        transition: "none",
      };
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="x"
      bounds={{ left: -300, right: 300 }}
      onDrag={handleDrag}
      onStop={handleStop}
      disabled={isFlying}
    >
      <div
        ref={nodeRef}
        style={{
          width: 250,
          height: 350,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          position: "absolute",
          top: 0,
          left: 0,
          cursor: "grab",
          userSelect: "none",
          ...getTransformStyle(), 
        }}
      >
        <Image
          width={220}
          height={220}
          src={image}
          alt={title}
          style={{ borderRadius: 8 }}
        />
        <div style={{ textAlign: "center" }}>
          <Typography.Title level={5}>{title}</Typography.Title>
          <Typography.Text>{description}</Typography.Text>
          <br />
          <Typography.Text strong>IMDB: {imdb}</Typography.Text>
        </div>
      </div>
    </Draggable>
  );
}
