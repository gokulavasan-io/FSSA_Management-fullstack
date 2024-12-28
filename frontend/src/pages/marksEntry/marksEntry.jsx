import React, { useState, useEffect,useMemo } from "react";
import axios from "axios";
import "./marksEntry.css";
import Sidebar from "./sidebar/sideBar.jsx";
import API_PATHS from "../../constants/apiPaths.js";
import { DndProvider, HTML5Backend } from "../../utils/dragAndDropImports.js";
import { Box, Typography, Paper } from "../../utils/materialImports.js";
import { categoryMark } from "../../constants/constValues.js";
import {dayjs} from '../../utils/dateImports.js';
import MainTable from "./table/mainTable.jsx";
import TestTable from "./table/testTable.jsx";
import Chart from "./chartAndCountTable/chart.jsx";
import CountTable from "./chartAndCountTable/countTable.jsx";

const MarkEntry = () => {
  const month = "January";
  const subject = "English";
  const section = "A";


  const [testTableData, setTestTableData] = useState([]);
  const [totalMark, setTotalMark] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
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


  const testTableColumns = useMemo(
    () => [
      { title: "Student", width: 200, readOnly: true },
      { title: `Mark (out of ${totalMark})`, width: 100, editor: "text" },
      { title: "Mark (out of 100)", width: 100, readOnly: true },
      { title: "Remark", width: 100 },
    ],
    [totalMark]
  );

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


  const [showStatus, setShowStatus] = useState(false);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(true);
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
    testTableData,
    subject,
    setTestTableData,
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
    testId,setTestId,
    setIsUpdated,
    categoryMark,
    isUpdated,
    setPreviousTestName,
    setPreviousTotalMark,
    previousTestName,
    previousTotalMark,
    selectedDate,setSelectedDate,testTableColumns
  };
  const exportDataProps={testTableData,testTableColumns,mainTableData,mainTableColumns,isMainTable,totalMark,testName,subject,month,section}

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Sidebar {...sidebarProps} {...exportDataProps} />
      </DndProvider>

      {showStatus&& <Box
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
          {isMainTable && mainTableColumns.length < 3  && 
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

      </Box>}
    </>
  );
};

export default MarkEntry;
