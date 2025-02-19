import React, { useEffect } from "react";
import "./styles/MarksEntry.css";
import { Card, Typography,Row, Col, } from "antd";
import TestDetailSideBar from "./Components/TestDetailSidebar/TestDetailSidebar";
import MainTable from "./Components/MarksTable/MainTable";
import MarkEntryTable from "./Components/MarksTable/MarksEntryTable";
import LevelEntryTable from "./Components/MarksTable/LevelEntryTable";
import ChartForCategory from "./Components/Charts/ChartForMarkTable";
import AdminTestForm from "./Components/AdminTestForm/AdminTestForm";
import {
  fetchAllTestMarksForMonth,
  fetchTestDetails,
} from "../../api/marksAPI.js";
import { useMarksContext } from "../../Context/MarksContext";

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
      let mainTableData = await fetchAllTestMarksForMonth(
        section,
        monthId,
        subjectId
      );
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
    <div style={{ display: "flex", width: "100%", height: "100%" }}>

    <TestDetailSideBar />

    {/* Main Content */}
    <div style={{ flex: 1, transition: "margin-left 0.3s ease" }}>
      {showStatus && (
        <Row gutter={5} justify="center">
          <Col xs={24} lg={16}>
            <div style={{ padding: "16px", width: "100%" }}>
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

          <Col xs={24} lg={8}>
            <ChartForCategory />
          </Col>
        </Row>
      )}

      <AdminTestForm />
     </div>
</div>

  );
};

export default MarksMain;
