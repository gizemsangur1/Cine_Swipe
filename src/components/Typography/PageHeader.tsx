import { Typography } from "@mui/material";
import React from "react";

interface PageHeaderProps {
  pageTitle: string;
}


export default function PageHeader({
  pageTitle,
}: PageHeaderProps) {
  return (
    <Typography
      style={{
        fontWeight: "bold",
        fontSize: "36px",
        color: "white",
        marginTop: "30px",
      }}
    >
      {pageTitle}
    </Typography>
  );
}
