import { Grid, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

interface MenuTypographyProps {
  pageTitle: string;
  page: string;
  icon?: React.ElementType;
}

export default function MenuTypography({
  pageTitle,
  page,
  icon: Icon,
}: MenuTypographyProps) {
  return (
    <Link href={page} style={{ textDecoration: "none", width: "100%" }}>
      <Grid
        container
        alignItems="center"
        sx={{
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background 0.2s ease",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
        }}
      >
        <Grid size={2} sx={{ display: "flex", justifyContent: "center" }}>
          {Icon && <Icon fontSize="small" sx={{ color: "black" }} />}
        </Grid>
        <Grid size={10}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              color: "black",
            }}
          >
            {pageTitle}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  );
}
