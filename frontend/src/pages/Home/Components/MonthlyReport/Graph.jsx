import React from "react";
import { Card, Typography } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const { Title } = Typography;


const Graph = ({data,months,title,height} ) => {

  const options = {
    chart: {
      type: "spline",
      width: null,
      height: height,
    },
    title: false,
    xAxis: {
      categories: months,
    },
    yAxis: {
      title: { text: "Score" },
      max:100,
       tickPositions: [0, 25, 50, 75, 100], 
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

  return (
    <Card
      style={{
        borderRadius: 6,
        boxShadow: "0 1px 0 0 #cfd7df",
        width: "100%",
        maxWidth: 1000,
        height: 350,
      }}
      bodyStyle={{ padding: "8px 10px" }}
    >
      <Title level={5} style={{ margin: 3, marginLeft: 12, color: "#183247" }}>
        {title}
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

export default Graph;
