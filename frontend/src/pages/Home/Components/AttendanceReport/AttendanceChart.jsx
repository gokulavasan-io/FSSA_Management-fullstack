import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Typography } from "antd";

const { Title } = Typography;

const AttendanceChart = ({ attendanceData, studentData, setPopoverVisible, setPopoverContent, setPopoverPosition }) => {
  const options = {
    chart: {
      type: "pie",
      height: 180,
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
        center: ["40%", "40%"],
        events: {
          click: function (event) {
            const category = event.point.name;
            const students = studentData[category] || [];

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

            setPopoverPosition({ x: event.pageX, y: event.pageY - 100 });
            setPopoverVisible(true);
          },
        },
      },
    },
    legend: {
      itemStyle: {
        fontSize: "9px",
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default AttendanceChart;
