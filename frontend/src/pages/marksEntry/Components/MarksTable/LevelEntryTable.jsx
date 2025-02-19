import React, {
    useEffect,
    useCallback,
    useRef,
  } from "react";
import axios from "axios";
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import {
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';

import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

  import API_PATHS from "../../../../constants/apiPaths.js";
  import { levelRegex } from "../../../../constants/regex.js";
  import ChartForLevel from "../Charts/ChartForLevelTable.jsx";
  import "../../styles/MarksEntry.css";
  import { useMarksContext } from "../../../../Context/MarksContext.jsx";
  
  function LevelTestTable() {
    const {
      testId,
      testTableData,
      setTestTableData,
      isUpdated,
      setIsUpdated,
      isEdited,
      setIsEdited,
    } = useMarksContext();
    const hotTableRef = useRef(null);
  
    const testTableColumns = [
      { title: "Student", width: 200, readOnly: true },
      { title: "Level", width: 100, editor: "text" },
      { title: "Remark", width: 100 },
    ];
  
    const transformMarksData = (data) => ({
      studentsMark: Object.values(data).map((item) => ({
        student_id: item.student_id,
        level: item.level !== "" ? item.level : null,
        remark: item.remark || "",
      })),
    });
  
    const handleUpdate = () => {
      const formattedData = transformMarksData(testTableData);
  
      axios
        .put(`${API_PATHS.UPDATE_LEVEL}${testId}/`, formattedData)
        .then((response) => {
          console.log("Marks data updated successfully!", response.data);
          setIsUpdated((prev) => !prev);
        })
        .catch((error) => {
          console.error("Error submitting marks data:", error.message);
          alert("Something went wrong. Try again later.", "error");
        });
    };
  
    const handleDataChange = useCallback((changes) => {
      if (!changes) return;
  
      // Get the Handsontable instance to get the current row index after sorting
      const instance = hotTableRef.current.hotInstance;
  
      setTestTableData((prevData) => {
        const updatedData = { ...prevData };
  
        changes.forEach(([row, col, , newValue]) => {
          // Get the actual row index after sorting
          const sortedRowIndex = instance.toPhysicalRow(row); // Get physical row index after sorting
          const studentId = Object.keys(prevData)[sortedRowIndex]; // Use the sorted row index
  
          // Determine the column name based on the column index
          const field =
            col === 0 ? "student_name" : col === 1 ? "level" : "remark";
  
          // Update the data
          updatedData[studentId][field] = newValue;
        });
  
        setIsEdited(true);
        return updatedData;
      });
    }, []);
  
    const handleBeforeChange = (changes, source) => {
      if (!changes) return;
  
      for (let i = 0; i < changes.length; i++) {
        const [row, col, oldValue, newValue] = changes[i];
  
        if (col == 1) {
          if (levelRegex.test(newValue) || newValue == "" || !newValue) {
            changes[i][3] = newValue;
          } else {
            alert("Invalid input. It must be from 1 to 10.");
            changes[i][3] = oldValue;
          }
        }
      }
    };
  
    const handleReset = async () => {
      try {
        const initialData = await fetchData();
        setTestTableData(initialData);
        setIsEdited(false);
      } catch (error) {
        console.error("Error in handleReset:", error);
      }
    };
  
    useEffect(() => {
      setIsEdited(false);
    }, [testId, isUpdated]);
  
    const fetchData = async () => {
      try {
        const apiUrl = `${API_PATHS.GET_LEVEL}${testId}/`;
        const response = await axios.get(apiUrl);
        return response.data.marks;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
  
    const cellRenderer = function (
      instance,
      td,
      row,
      col,
      prop,
      value,
      cellProperties
    ) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      if (col == 1) td.classList.add("cell-center");
      if (col === 0 || col === 1 || col === 2) td.classList.add("cell-names");
    };
  
    useEffect(() => {
      (async () => {
        try {
          const initialData = await fetchData();
          setTestTableData(initialData);
        } catch (error) {
          console.error("Error in useEffect:", error);
        }
      })();
    }, [testId]);
  
    const chartProps = { testTableData };
    return (
      <>
        <Typography
          variant="h5"
          sx={{
            marginBottom: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          color="primary"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              variant="contained"
              onClick={handleReset}
              disabled={!isEdited}
              sx={{
                backgroundColor: "#ff4c4c",
                "&:hover": { backgroundColor: "#ff0000", marginLeft: 2 },
              }}
            >
              Reset
            </Button>
  
            <Button
              size="small"
              color={"success"}
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleUpdate}
              disabled={!isEdited}
              sx={{ marginLeft: 1 }}
            >
              {"Save"}
            </Button>
          </Box>
        </Typography>
  
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
          <Paper
            elevation={3}
            sx={{ padding: 2, width: "100%", maxWidth: "1000px" }}
          >
            <HotTable
              ref={hotTableRef}
              data={Object.values(testTableData).map(
                ({ student_name, level, remark }) => [student_name, level, remark]
              )}
              colHeaders={testTableColumns.map((col) => col.title)}
              columns={testTableColumns}
              width="100%"
              height="auto"
              autoRowSize={true}
              licenseKey="non-commercial-and-evaluation"
              afterChange={handleDataChange}
              beforeChange={handleBeforeChange}
              rowHeaders={true}
              columnSorting={true}
              stretchH="all"
              cells={(row, col) => {
                return { renderer: cellRenderer };
              }}
            />
          </Paper>
          <Box sx={{ width: "20%", marginTop: 2 }}>
            <ChartForLevel />
          </Box>
        </Box>
      </>
    );
  }
  
  export default LevelTestTable;
  