import React from "react";
import Graph from "./Graph";
import { Row,Col } from "antd";

let data = [
  {
    name: "Class A",
    data: [10, 20, 30, 40, 60, 45, 70, 55, 45, 50, 60, 35],
    color: "#52c41a",
    marker: { symbol: "circle" },
  },
  {
    data: [20, 30, 25, 50, 80, 60, 90, 70, 50, 65, 80, 40],
    name: "Class B",
    color: "#faad14",
    marker: { symbol: "circle" },
  },
  {
    name: "Class C",
    data: [15, 25, 22, 35, 55, 50, 65, 60, 55, 58, 68, 45],
    color: "#ff4d4f",
    marker: { symbol: "circle" },
  },
  {
    name: "All",
    data: [18, 28, 27, 42, 65, 52, 75, 62, 48, 57, 70, 42],
    color: "#1890ff",
    marker: { symbol: "circle" },
  },
];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


function SubjectAnalysis() {
    return (
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Graph title={"English"} months={months} data={data} height={250} />
        </Col>
        <Col span={12}>
          <Graph title={"Life Skills"} months={months} data={data} height={250} />
        </Col>
        <Col span={12}>
          <Graph title={"Tech"} months={months} data={data} height={250} />
        </Col>
        <Col span={12}>
          <Graph title={"Problem Solving"} months={months} data={data} height={250} />
        </Col>
      </Row>
    );
  }
  
export default SubjectAnalysis;
