import { Col, Row, Typography } from "antd";
import React from "react";
import AiRecommend from "./AiRecommend";

export default function MainPage() {
  return (
    <Row
      style={{
        width: "100%",
        minHeight: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
        textAlign: "center",
      }}
    >
      <Col style={{ justifyContent: "center" }}>
        <Typography style={{ fontWeight: "bold", fontSize: "36px" }}>
          Describe The Movie You Want
        </Typography>
        <Row style={{ width: "100%", justifyContent: "space-around" }}>
          <AiRecommend/>
        </Row>
        
      </Col>
    </Row>
  );
}
