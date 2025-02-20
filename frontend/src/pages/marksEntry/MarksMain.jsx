import React, { useEffect } from "react";
import "./styles/MarksEntry.css";
import {  Typography, Row, Col } from "antd";
import TestDetailSideBar from "./Components/TestDetailSidebar/TestDetailSidebar";
import MainTable from "./Components/MarksTable/MainTable";
import MarkEntryTable from "./Components/MarksTable/MarksEntryTable";
import LevelEntryTable from "./Components/MarksTable/LevelEntryTable";
import ChartForCategory from "./Components/Charts/ChartForMarkTable";
import AdminTestForm from "./Components/AdminTestForm/AdminTestForm";
import { fetchAllTestMarksForMonth, fetchTestDetails } from "../../api/marksAPI.js";
import { useMarksContext } from "../../Context/MarksContext";
import ChartForLevelTable from "./Components/Charts/ChartForLevelTable.jsx";

const MarksMain = () => {
  const {
    monthId,
    subjectId,
    section,
    isLevelTable,
    isUpdated,
    isMainTable,
    setTestDetails,
    setMainTableData,
    mainTableColumns,
    setMainTableColumns,
    showStatus,
    setShowStatus,sidebarOpen
  } = useMarksContext();

  useEffect(() => {
    (async function () {
      let mainTableData = await fetchAllTestMarksForMonth(section, monthId, subjectId);
      let testDetails = await fetchTestDetails(monthId, subjectId);
      createMainTableData(mainTableData);
      setTestDetails(testDetails);
    })();
  }, [isMainTable, isUpdated, monthId, subjectId]);

  function createMainTableData(data) {
    if (!data || !data.testNames || !Array.isArray(data.testNames)) {
      console.error("Invalid data received:", data);
      setMainTableColumns([
        { title: "Student", width: 200, readOnly: true },
        { title: "Average mark", width: 100, readOnly: true },
      ]);
      setMainTableData([]);
      return;
    }

    setMainTableColumns(() => {
      let columnData = [
        { title: "Student", width: 200, readOnly: true },
        { title: "Average mark", width: 100, readOnly: true },
      ];

      data.testNames.forEach((testName) => {
        columnData.push({
          title: testName,
          width: 100,
          readOnly: true,
        });
      });
      return columnData;
    });

    setMainTableData(data.student_avg_marks || []);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMainTable, mainTableColumns.length]);

  return (
    <div style={{ display: "flex", width: "100%", overflow: "hidden",justifyContent:"center",position:"relative",top:"-20px",height:"100%" }}>
        <div style={{ position: "absolute", zIndex: 1000 }}>
          <TestDetailSideBar />
        </div>

      {/* Main Content */}
      <div style={{ flex: 1, height: "100%",overflow:"hidden",width:"100%" }}>
        {showStatus && (
          <Row gutter={30} style={{alignItems:"center",justifyContent:"center"}} >
            <Col xs={24} lg={18} style={{ height: "100%", display: "flex", flexDirection: "column"}}>
              <div style={{ flex: 1, width: "100%", height: "100%"}}>
                {isMainTable && mainTableColumns.length > 2 && <MainTable />}
                {!isMainTable && !isLevelTable && <MarkEntryTable />}
                {!isMainTable && isLevelTable && <LevelEntryTable />}

                {isMainTable && mainTableColumns.length < 3 && (
                  <Typography.Title level={4} style={{ textAlign: "center", color: "#1890ff" }}>
                    No tests added yet
                  </Typography.Title>
                )}
              </div>
            </Col>

            <Col xs={24} lg={6} style={{ height: "100%", display: "flex", flexDirection: "column"}}>
              <div style={{ flex: 1, width: "100%" }}>
                {!isLevelTable && <ChartForCategory />}
                {isLevelTable && <ChartForLevelTable />}
              </div>
            </Col>
          </Row>
        )}

        <AdminTestForm />
      </div>
</div>

  );
  
};

export default MarksMain;
