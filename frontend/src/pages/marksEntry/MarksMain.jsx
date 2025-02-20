import React, { useEffect } from "react";
import "./styles/MarksEntry.css";
import { Row, Col, Empty } from "antd";
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
import ChartForLevelTable from "./Components/Charts/ChartForLevelTable.jsx";
import { useMainContext } from "../../Context/MainContext.jsx";
import Loader from "../UxComponents/Loader.jsx";

const MarksMain = () => {
  const {
    monthId,
    subjectId,
    isLevelTable,
    isMainTable,
    setIsMainTable,
    setTestDetails,
    setMainTableData,
    mainTableColumns,
    setMainTableColumns,
  } = useMarksContext();

  const {sectionId, loading, setLoading } = useMainContext();

  // Fetch data when month or subject changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let mainTableData = await fetchAllTestMarksForMonth(
          sectionId,
          monthId,
          subjectId
        );
        let testDetails = await fetchTestDetails(monthId, subjectId);

        createMainTableData(mainTableData);
        setTestDetails(testDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Hide loader and show content
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, [monthId, subjectId,isMainTable]);


  useEffect(() => {
    setIsMainTable(true);
  }, [monthId, subjectId]);

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

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        overflow: "hidden",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div style={{ position: "absolute", zIndex: 1000 }}>
        <TestDetailSideBar />
      </div>

      {/* Main Content */}
      <div
        style={{ flex: 1, height: "100%", overflow: "hidden", width: "100%" }}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <Row
              gutter={24}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Col
                xs={24}
                lg={18}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ flex: 1, width: "100%", height: "100%" }}>
                  {isMainTable && mainTableColumns.length > 2 && <MainTable />}
                  {!isMainTable && !isLevelTable && <MarkEntryTable />}
                  {!isMainTable && isLevelTable && <LevelEntryTable />}
                </div>
              </Col>

              <Col
                xs={24}
                lg={6}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ flex: 1, width: "100%" }}>
                  {!isLevelTable && mainTableColumns.length > 3 && (
                    <ChartForCategory />
                  )}
                  {isLevelTable && mainTableColumns.length > 3 && (
                    <ChartForLevelTable />
                  )}
                </div>
              </Col>
            </Row>

            {isMainTable && mainTableColumns.length < 3 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Empty description="No tests added yet." />
              </div>
            )}
          </>
        )}

        <AdminTestForm />
      </div>
    </div>
  );
};

export default MarksMain;
