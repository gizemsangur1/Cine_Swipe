import { Button } from "@mui/material";
import React from "react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Button
      onClick={onLogout}
      sx={{
        marginTop: "10px",
        backgroundColor: "#C5172E",
        color: "white",
        height: "35px",
        textTransform: "none",
        width: "100%",
        "&:hover": { backgroundColor: "#8E1616" },
      }}
    >
      Logout
    </Button>
  );
}
