import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card } from "antd"; 

const Chart = ({title,months,data}) => {

  const options = {
    chart: {
      type: "column",
      height:200
    },
    title: false,
    xAxis: {
      categories: months,
    },
    yAxis: {
      title: false,
      min: 0,
      max: 100,
      tickPositions: [0, 25, 50, 75, 100],
    },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        groupPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: data,
    credits: { enabled: false },
    legend:false
  };

  return (
   <>
    <Card  title={<span style={{ color: "#183247" }}>{title}</span>} style={{ margin: "16px",borderRadius: 6, boxShadow: "0 1px 0 0 #cfd7df" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
    </>
  );
};

export default Chart;
