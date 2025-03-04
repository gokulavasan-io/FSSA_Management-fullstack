import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Typography } from "antd";

const { Title } = Typography;

const AttendanceChart = ({ attendanceData, studentData, setPopoverVisible, setPopoverContent, setPopoverPosition }) => {

  const handleChartClick = (event) => {
    const category = event.point.name;
    const students = studentData[category] || [];
    
    const browserEvent = event.originalEvent || {}; 
  
    setPopoverContent(
      <div>
        <Title level={5} style={{ color: "#8e44ad" }}>{category} Students</Title>
        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "500px", gap: "5px" }}>
          {students.length > 0
            ? students.map((student, index) => (
                <span key={index} style={{ display: "inline-block", color: "#71797E" }}>
                  {`${student}, `}
                </span>
              ))
            : "No students"}
        </div>
      </div>
    );
  
    setPopoverPosition({
      x: browserEvent.pageX || 0, 
      y: (browserEvent.pageY || 0),
    });
  
    setPopoverVisible(true);
  };
  

  const options = {
    chart: {
      type: "pie",
      height: 220,
    },
    title: false,
    series: [
      {
        name: "Students",
        colorByPoint: true,
        data: attendanceData,
      },
    ],
    accessibility: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        center: ["30%", "50%"],
        events:  { click: handleChartClick }
      },
    },
    legend: {
      itemStyle: {
        fontSize: "12px"
      },
      layout: "vertical",
      align: "right",
      verticalAlign: "center",
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%",width:"100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AttendanceChart;
