"use client";
import { Button } from "@mui/material";

interface SubmitButtonProps {
  title: string;
  type?: "button" | "submit"; 
  loading?: boolean;
  onClick?: () => void;
}

export default function SubmitButton({
  title,
  type = "button",
  loading = false,
  onClick,
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      variant="contained"
      onClick={onClick}
      disabled={loading}
      sx={{
        backgroundColor: "#C5172E",
        "&:hover": { backgroundColor: "#8E1616" },
        textTransform: "none",
        borderRadius:"25px",
        padding:"10px 25px"
      }}
    >
      {loading ? "Loading..." : title}
    </Button>
  );
}
