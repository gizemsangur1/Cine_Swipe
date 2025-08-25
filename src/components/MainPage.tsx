import React from "react";
import AiRecommend from "./AiRecommend";
import PageHeader from "./Typography/PageHeader";
import { Grid } from "@mui/system";
import { Typography } from "antd";

export default function MainPage() {
  return (
    <Grid
      container
      sx={{
        width: "100%",
        minHeight: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
        textAlign: "center",
        color: "white",
      }}
    >
      <Grid size={7} sx={{ justifyContent: "center" }}>
        <Typography
          style={{
            fontWeight: "bold",
            fontSize: "36px",
            color: "white",
            marginTop: "30px",
          }}
        >
          Describe The Movie You Want
        </Typography>
        <Grid
          size={5}
          sx={{ width: "100%", justifyContent: "center" ,marginTop:"15px"}}
        >
          <AiRecommend />
        </Grid>
      </Grid>
    </Grid>
  );
}
