import React, { useState, useEffect } from "react";
import axios from "axios";
import "./marksEntry.css";
import Sidebar from "./sidebar/sideBar.jsx";
import API_PATHS from "../../constants/apiPaths.js";
import { DndProvider, HTML5Backend } from "../../utils/dragAndDropImports.js";
import { Box, Typography, Paper } from "../../utils/materialImports.js";
import MainTable from "./table/mainTable.jsx";
import TestTable from "./table/testTable.jsx";
import { categoryMark } from "../../constants/constValues.js";

const MarkEntry = () => {
  const month = "January";
  const subject = "English";
  const section = "A";

  const [data, setData] = useState([]);
  const [totalMark, setTotalMark] = useState("");
  const [previousTotalMark, setPreviousTotalMark] = useState("");
  const [testName, setTestName] = useState("");
  const [previousTestName, setPreviousTestName] = useState("");
  const [testId, setTestId] = useState(null);
  const [testNames, setTestNames] = useState([]);
  const [error, setError] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [isArchivedStatusChanged, setIsArchivedStatusChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isMainTable, setIsMainTable] = useState(true);
  const [testDetails, setTestDetails] = useState([]);
  const [mainTableData, setMainTableData] = useState([]);
  const [mainTableColumns, setMainTableColumns] = useState([]);
  const [showMainTableColor, setShowMainTableColor] = useState(false);

  useEffect(() => {
    if (section && month) {
      axios
        .get(
          `${API_PATHS.GET_ALL_DATA}?section=${section}&month=${month}&subject=${subject}`,
        )
        .then((response) => {
          setTestDetails(response.data.test_details || []);
          setTestNames(
            response.data.test_details.map(
              (test) => test.test_detail.test_name,
            ),
          );
          mainTableCreate(response.data);
          setIsArchivedStatusChanged(false);
        })
        .catch((error) => {
          console.error("Error fetching test names:", error);
        });
    }
  }, [isSaved, isMainTable, isArchivedStatusChanged, isUpdated]);

  const handleOptionClick = (testId) => {
    setTestId(testId);
    setIsMainTable(false);
  };

  function mainTableCreate(fullData) {
    setMainTableColumns(() => {
      let columnData = [
        { title: "Student", width: 200, readOnly: true },
        { title: "Average mark", width: 100, readOnly: true },
      ];

      fullData.test_details.forEach((test) => {
        if (!test.test_detail.isArchived) {
          columnData.push({
            title: test.test_detail.test_name,
            width: 100,
            readOnly: true,
          });
        }
      });
      return columnData;
    });
    setMainTableData(fullData.student_avg_marks);
  }


  const [showMessage, setShowMessage] = useState(false);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMainTable, mainTableColumns.length]);

  const sidebarProps = {
    onOptionClick: handleOptionClick,
    testDetails,
    setTestDetails,
    setIsMainTable,
    setIsArchivedStatusChanged,
  };

  const mainTableProps = {
    subject,
    month,
    showMainTableColor,
    mainTableData,
    mainTableColumns,
    setShowMainTableColor,
    categoryMark,
  };

  const testTableProps = {
    data,
    subject,
    setData,
    testName,
    setTestName,
    totalMark,
    setTotalMark,
    section,
    month,
    testNames,
    isSaved,
    setIsSaved,
    isEdited,
    setIsEdited,
    isArchived,
    setIsArchived,
    error,
    setError,
    testId,
    setIsUpdated,
    categoryMark,
    isUpdated,
    setPreviousTestName,
    setPreviousTotalMark,
    previousTestName,
    previousTotalMark,
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Sidebar {...sidebarProps} />
      </DndProvider>

      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 2, width: "100%", maxWidth: "1000px" }}
        >
          {!isMainTable && <TestTable {...testTableProps} />}
          {isMainTable && mainTableColumns.length > 2 && (
            <MainTable {...mainTableProps} />
          )}
          {isMainTable && mainTableColumns.length < 3 && showMessage && 
            <Typography
              variant="h5"
              sx={{
                marginBottom: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              color="primary"
            >
              <div>No tests added yet</div>
            </Typography>
          }
        </Paper>
      </Box>
    </>
  );
};

export default MarkEntry;
