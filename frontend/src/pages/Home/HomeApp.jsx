import React, { useEffect, useState } from "react";
import { Row, Col, Flex } from "antd";
import AttendanceReport from "./Components/AttendanceReport/AttendanceReport";
import AddNewTest from "../Admin/Components/Test/NewTest";
import AddHoliday from "../Admin/Components/Holiday/NewHoliday";
import SubjectAnalysis from "./Components/Analytics/SubjectAnalytics";
import MonthlyAnalytics from "./Components/Analytics/MonthlyAnalytics";
import GeneralFetch from '../Components/GeneralFetch'


function HomeApp() {

  function dummyFunc(){
    return
  }
  
  return (
    <>
    <GeneralFetch />
    <div style={{ overflowX: "hidden", overflowY: "auto", minHeight: "100%" }}>
      <Row gutter={16}>
        <Col span={17}>
          <MonthlyAnalytics   />
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
              <AddHoliday reFetchFunction={dummyFunc} />
              <AddNewTest  reFetchFunc={dummyFunc} />
            </Flex>
            <AttendanceReport />
          </Flex>
        </Col>
      </Row>
      
      <div style={{marginTop:16}} >
      <SubjectAnalysis />
      </div>
    </div>
    </>
  );
}

export default HomeApp;



