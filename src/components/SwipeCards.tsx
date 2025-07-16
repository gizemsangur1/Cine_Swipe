"use client";

import { Typography } from "antd";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

interface SwipeCardProps {
  onSwipe: (direction: "left" | "right") => void;
  image: string;
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

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    setXOffset(data.x);
  };

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
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
          height: 450,
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
          padding: "7px",
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
        <div style={{ textAlign: "center", padding: "0 5px" }}>
          <Typography.Title level={5} ellipsis>
            {title}
          </Typography.Title>
          <Typography.Paragraph ellipsis={{ rows: 5 }}>
            {description}
          </Typography.Paragraph>
          <Typography.Text strong>IMDB: {imdb.toFixed(1)}</Typography.Text>
        </div>
      </div>
    </Draggable>
  );
}
