import React, { useEffect, useCallback, useState,useRef } from "react";
import axios from "axios";
import API_PATHS from "../../../constants/apiPaths.js";
import { Handsontable, HotTable } from "../../../utils/handsOnTableImports";
import {DemoContainer,AdapterDayjs,LocalizationProvider,DatePicker} from "../../../utils/dateImports.js"
import {dayjs} from "../../../utils/dateImports.js";
import {
  Box,
  Button,
  Typography,
  TextField,
  SaveIcon,
  RefreshIcon,
} from "../../../utils/materialImports.js";
import TextArea from "./textArea.jsx";
import { testNameRegex } from "../../../constants/regex.js";
import { updateMarks } from "../../../api/marksAPI.js";
import { useMarksContext } from "../contextFile";

function TestTable() {
  const {
    testTableData,
    setTestTableData,
    testName,
    subject,
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
    error,
    setError,
    testId,
    setTestId,
    setIsUpdated,
    categoryMark,
    isUpdated,
    setPreviousTestName,
    setPreviousTotalMark,
    previousTestName,
    previousTotalMark,
    selectedDate,
    setSelectedDate,
    aboutTest,setAboutTest,setPreviousAboutTest,hotTableRef
  } = useMarksContext();

  

    const calculateMarksOutOf100 = (marks) => {
      if (marks === "A" || marks === "a") return "Absent";
      if (!marks || isNaN(marks)) return "";
      return ((parseFloat(marks) / totalMark) * 100).toFixed(2);
    };
    

  const transformMarksData = (marksObject, month, subject) => {
    return {
      subject: subject,
      test_name: testName.trim(),
      section: section,
      total_marks: totalMark,
      created_at: selectedDate,
      about_test: aboutTest.trim(),
      isLevelTest: false,
      batch: 4,
      students: marksObject,
    };
  };
  

  
  const handleUpdate = async () => {
    try {
      const formattedData = transformMarksData(testTableData, month, subject);
      await updateMarks(testId, formattedData);
    } catch (error) {
      console.error("Error submitting marks data:", error.message);
      alert('Something went wrong. Try again later.', "error");
    }
    };

  

  const handleDataChange = useCallback((changes) => {
    if (!changes) return;
  
    setTestTableData((prevData) => {
      const updatedData = [...prevData];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        updatedData[row] = {
          ...updatedData[row],
          [prop]: newValue
        };
        
        if (prop === "mark") {
          updatedData[row].average_mark = calculateMarksOutOf100(newValue);
        }
      });
      setIsEdited(true);
      return updatedData;
    });
  }, [calculateMarksOutOf100]);
  

  const handleBeforeChange = (changes, source) => {
    if (!changes) return;
    
    let shouldCancelChange = false;
  
    for (let i = 0; i < changes.length; i++) {
      const [row, prop, oldValue, newValue] = changes[i]; // Using property name instead of column index
     
      
      if (prop === "mark") {
        console.log(changes);
        
        if (newValue?.toLowerCase() === "a") {
          changes[i][2] = "Absent"; 
          continue;
        }
  
        const mark = parseFloat(newValue);
        
        if (mark > totalMark) {
          alert('Enter mark less than or equal to total mark', 'error');
          shouldCancelChange = true;
        } else if (mark < 0) {
          alert('Enter a positive number', 'error');
          shouldCancelChange = true;
        } else if (newValue !== "" && isNaN(mark)) {
          alert('Only "a" or "A" are allowed!', 'error');
          shouldCancelChange = true;
        }
  
        if (shouldCancelChange) {
          setTimeout(() => {
            const instance = hotTableRef.current.hotInstance;
            instance.selectCell(row, prop); // Refocus the problematic cell
            instance.setDataAtCell(row, prop, oldValue); // Reset to the old value
          }, 0);
          return false;
        }
  
        // Remove leading zeros if any
        if (/^0\d+$/.test(newValue)) {
          changes[i][2] = newValue.replace(/^0+/, "");
        }
      }
    }
  };
  
  
  

  const cellRenderer = function (instance, td, row, col, prop, value) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.classList.remove("cell-red", "cell-yellow", "cell-green");

    if (prop === "average_mark" && value !== "" && !isNaN(value)) {
      const averageMark = Math.round(parseFloat(value));
      if (averageMark <= categoryMark.redEndValue) {
        td.classList.add("cell-red");
      } else if (averageMark <= categoryMark.yellowEndValue) {
        td.classList.add("cell-yellow");
      } else{
        td.classList.add("cell-green");
      }
    }
    if (prop === "average_mark" && value == "Absent" ) {
      td.classList.remove("cell-red", "cell-yellow", "cell-green");
      td.classList.add("cell-absent");
    }
    if (prop === "average_mark" || prop === "mark" ) {
      td.classList.add("cell-center");
    }
    if (prop === "student_name" || prop === "mark" ||prop=="remark") {
      td.classList.add("cell-names");
    }
  };
  

  const handleReset = async () => {
    try {
      const initialData = await fetchData();
      setTestTableData(initialData);
      setError("");
      setIsEdited(false);
    } catch (error) {
      console.error("Error in handleReset:", error);
    }
  };

  const handleTotalMarkChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      setTotalMark(newValue);
      setIsEdited(true);
      if (isSaved && previousTotalMark == newValue) {
        setIsEdited(false);
      }
    }
  };

  const handleTestNameChange = (event) => {
    const input = event.target.value;
  
    // If the input is empty, allow it (for erasing)
    if (input === "") {
      setError("");
      setTestName(input);  // Allow clearing the input
      setIsEdited(false);   // Reset the edited state
      return;
    }
  
    // Validate the input using the raw input value
    if (!testNameRegex.test(input)) {
      setError("Invalid test name. It must be alphanumeric and can include spaces, underscores, or dashes.");
    } else if (testNames.includes(input) && (!isSaved || (isSaved && input !== previousTestName))) {
      setError("Test name already exists.");
    } else {
      setError("");  // Clear the error when the input is valid
      setTestName(input);
      setIsEdited(true);
    }
  
    // Only capitalize the first letter for display, after validation
    const formattedInput = input.charAt(0).toUpperCase() + input.slice(1);
    setTestName(formattedInput);
  
    // Check if the name is the same as the previous and it's already saved, don't mark it as edited
    if (previousTestName === formattedInput && isSaved) {
      setIsEdited(false);
    }
  };
  

  const handleStartEditingTestName = () => {
    if (isSaved) {
      setPreviousTestName(testName);
    }
  };
  const handleTotalMarkKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
  
      const updatedData = testTableData.map((row) => {
        const marks = row.mark;
  
        // Reset mark if it exceeds totalMark
        if (marks !== "" && !isNaN(marks) && parseFloat(marks) > totalMark) {
          row.mark = "";
        }
  
        // Calculate average if valid marks are entered
        row.average_mark = marks !== "" && marks.toLowerCase() !== "a" 
          ? calculateMarksOutOf100(marks) 
          : "";
  
        return row;
      });
  
      setTestTableData(updatedData);
      event.target.blur();
    }
  };
  

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  };

  useEffect(() => {
    setIsEdited(false);
  }, [testId, isSaved, isUpdated]);

  const fetchData = async () => {
    try {
      const apiUrl = testId
        ? `${API_PATHS.GET_MARK}${testId}/`
        : `${API_PATHS.GET_STUDENTS_NAME}?section=${section}`;

      const response = await axios.get(apiUrl);
      if (testId) {
        setTotalMark(response.data.test_detail.total_marks);
        setPreviousTotalMark(response.data.test_detail.total_marks);
        setTestName(response.data.test_detail.test_name);
        setPreviousTestName(response.data.test_detail.test_name);
        setAboutTest(response.data.test_detail.about_test)
        setPreviousAboutTest(response.data.test_detail.about_test)
        setIsSaved(true);
        const parsedDate = dayjs(response.data.test_detail.created_at, "YYYY-MM-DD HH:mm:ss");
        setSelectedDate(parsedDate); 
        
        return response.data.marks
      } 
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
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
        <div>{testName ? testName : "New Test Name"}</div>
        <Box sx={{ display: "flex", alignItems: "center",gap:"5px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}  >
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Date"
            value={selectedDate|| dayjs()}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setIsEdited(true);
              console.log(newValue);
              
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  width: 'auto',
                },
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>

          

          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "8ch" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-size-small"
              size="small"
              label="Total mark"
              variant="outlined"
              type="text"
              value={totalMark}
              onChange={handleTotalMarkChange}
              onKeyPress={handleTotalMarkKeyPress}
            />
          </Box>
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1, width: "8ch" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-size-small"
              size="small"
              label="Test name"
              variant="outlined"
              type="text"
              value={testName}
              onChange={handleTestNameChange}
              onFocus={handleStartEditingTestName}
              error={!!error}
              helperText={error}
              onKeyPress={handleKeyPress}
            />
          </Box>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            variant="contained"
            onClick={handleReset}
            disabled={!isEdited}
            sx={{
              backgroundColor: "#ff4c4c",
              "&:hover": { backgroundColor: "#ff0000",marginLeft: 2 },
            }}
          >
            Reset
          </Button>

          <Button
            size="small"
            color={isSaved ? "primary" : "success"}
            startIcon={isSaved ? <SaveIcon /> : <SaveIcon />}
            variant="contained"
            onClick={ handleUpdate}
            disabled={
              !!error ||
              !month ||
              !totalMark ||
              !isEdited
            }
            sx={{ marginLeft: 1 }}
          >
            {isSaved ? "Update" : "Save"}
          </Button>
        </Box>
      </Typography>
      <HotTable
        ref={hotTableRef}
        data={testTableData}
        columns={[
          { data: "student_name", title: "Student Name" },
          { data: "mark", title: `Mark (${totalMark})` },
          { data: "average_mark", title: `Average` },
          { data: "remark", title: "Remark" }
        ]}
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
    <TextArea  />

    </>
  );
}

export default TestTable;
