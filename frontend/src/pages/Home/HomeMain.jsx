import React from "react";
import { Row, Col, Flex } from "antd";
import AttendanceReport from "./Components/AttendanceReport/AttendanceReport";
import AddNewTest from "../MarksEntry/Components/AddNewTest/AddNewTest";
import AddHoliday from "../Attendance/Components/Holiday/AddHoliday";
import SubjectAnalysis from "./Components/MonthlyReport/SubjectAnalysis";
import Graph from "./Components/MonthlyReport/Graph";



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

let title = "Monthly Analysis";


function HomeMain() {
  return (
    <div style={{ overflowX: "hidden", overflowY: "auto", minHeight: "100%" }}>
      <Row gutter={16}>
        <Col span={17}>
        <Graph title={title} months={months} data={data} height={280} />
        </Col>

        <Col span={7} style={{ height: 350 }}>
          <Flex
            vertical
            justify="space-between"
            gap={8}
            style={{ height: "100%" }}
          >
            <Flex
              justify="center"
              align="center"
              gap={24}
              style={{ height: 56 }}
            >
              <AddHoliday />
              <AddNewTest />
            </Flex>
            <AttendanceReport />
          </Flex>
        </Col>
      </Row>
      
      <div style={{marginTop:16}} >
      <SubjectAnalysis />
      </div>
    </div>
  );
}

export default HomeMain;
