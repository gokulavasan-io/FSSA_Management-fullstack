import React from "react";
import { Row, Col, Flex } from "antd";
import AttendanceReport from "./Components/AttendanceReport/AttendanceReport";
import MonthlyAnalysis from "./Components/MonthlyReport/MonthlyAnalysis";
import AddNewTest from "../MarksEntry/Components/AddNewTest/AddNewTest";
import AddHoliday from "../Attendance/Components/Holiday/AddHoliday";

function HomeMain() {
  return (
    <div style={{ overflowX: "hidden", overflowY: "auto", minHeight: "100%" }}>
      <Row gutter={16}>
        <Col span={17}>
          <MonthlyAnalysis />
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
    </div>
  );
}

export default HomeMain;
