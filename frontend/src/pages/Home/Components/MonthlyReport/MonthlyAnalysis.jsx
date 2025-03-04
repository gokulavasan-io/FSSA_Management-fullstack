import React from "react";
import { Card, Typography } from "antd";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";

const { Title } = Typography;

let data = [
  {
    name: "Class A",
    data: [20, 30, 25, 50, 80, 60, 90, 70, 50, 65, 80, 40],
    color: "#52c41a",
    marker: { symbol: "circle" },
  },
  {
    name: "Class B",
    data: [10, 20, 30, 40, 60, 45, 70, 55, 45, 50, 60, 35],
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

const options = {
  chart: {
    type: "spline",
    width: null,
    height: 280,
  },
  title: false,
  xAxis: {
    categories: months,
  },
  yAxis: {
    title: { text: "Score" },
  },
  legend: {
    layout: "horizontal",
    align: "center",
    verticalAlign: "bottom",
  },
  series: data,
  credits: { enabled: false },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 600,
        },
        chartOptions: {
          legend: { align: "center", verticalAlign: "bottom" },
          yAxis: { title: { text: "" } },
        },
      },
    ],
  },
};

const MonthlyAnalysis = () => {
  return (
    <Card
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 1000,
        height: 350,
      }}
      bodyStyle={{ padding: "8px 10px" }}
    >
      <Title level={5} style={{ margin: 3, marginLeft: 12, color: "#0047AB" }}>
        Monthly Analysis
      </Title>
      <hr
        style={{ backgroundColor: "#839192", height: ".5px", border: "none" }}
      />

      <div style={{ width: "100%", overflowX: "auto", marginTop: 16,height:"100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default MonthlyAnalysis;
