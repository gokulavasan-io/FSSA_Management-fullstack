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
import ChartForCategory from "./charts/chartForNormalTable.jsx";
import ChartForLevel from "./charts/chartForLevelTable.jsx";
import LevelTestTable from "./table/testTable(level).jsx";
import AdminTestForm from "./adminTestForm.jsx";
import { fetchAllMarks } from "../../api/marksAPI.js";
import { useMarksContext } from "./contextFile";


const MarkEntry = () => {
  

  const {
    month,
    section,subject,
    setTestId,
    setTestNames,
    isLevelTable,
    setIsLevelTable,
    isSaved,
    isUpdated,
    isMainTable,
    setIsMainTable,
    setTestDetails,
    setMainTableData,
    mainTableColumns,
    setMainTableColumns,
  } =useMarksContext()

  const [showStatus, setShowStatus] = useState(false);


  useEffect( () => {
      (async function () {
        let response= await fetchAllMarks(section,month,subject);
        console.log(response);
        
          setTestDetails(response.test_details || []);
          setTestNames(
            response.test_details.map(
              (test) => test.test_detail.test_name,
            ),
          );
          mainTableCreate(response);
      })()
  }, [isSaved, isMainTable, isUpdated]);

  
  function mainTableCreate(fullData) {
    setMainTableColumns(() => {
      let columnData = [
        { title: "Student", width: 200, readOnly: true },
        { title: "Average mark", width: 100, readOnly: true },
      ];

      fullData.test_details.forEach((test) => {
        if (!test.test_detail.isLevelTest) {
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



 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMainTable, mainTableColumns.length]);

 


  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Sidebar  />
      </DndProvider>

      {showStatus && (
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            marginLeft: "10%",
            gap: "3rem",
            paddingBlock: "1rem",
          }}
        >
    <Paper elevation={3} sx={{ padding: 2, width: "100%", maxWidth: "1000px" }}>
      {!isMainTable && !isLevelTable &&<TestTable  />}
      {isMainTable && mainTableColumns.length > 2 && <MainTable  />}
      {!isMainTable && isLevelTable && <LevelTestTable /> }
      {isMainTable && mainTableColumns.length < 3 && (
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
      )}
    </Paper>
    
    {/* Increase width of the chart container */}
    {!isLevelTable && <Box sx={{ width: "20%", marginTop: 2 }}>
      <ChartForCategory  />
    </Box>}
  </Box>
      )}
      {/* <AdminTestForm /> */}
    </>
  );
};

export default MarkEntry;
