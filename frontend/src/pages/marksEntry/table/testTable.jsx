import React, { useEffect, useCallback, useState,useRef } from "react";
import axios from "axios";
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
import API_PATHS from "../../../constants/apiPaths.js";
import TextArea from "./textArea.jsx";
import { testNameRegex } from "../../../constants/regex.js";

function TestTable(props) {
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
    isArchived,
    setIsArchived,
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
    setSelectedDate,testTableColumns
  } = props;
    const [aboutTest, setAboutTest] = useState('');
    const [previousAboutTest,setPreviousAboutTest]=useState('')
    const hotTableRef = useRef(null);


  const calculateMarksOutOf100 = (marks) => {
    if (!marks) return "";
    if (marks === "" || isNaN(marks) || marks === "A") return "";
    return ((parseFloat(marks) / totalMark) * 100).toFixed(2);
  };
  const transformMarksData = (marksArray, month, subject) => {
    return {
      month: month,
      subject: subject,
      test_name: testName.trim(),
      section: section,
      total_marks: totalMark,
      isArchived: isArchived,
      created_at: selectedDate,
      about_test:aboutTest.trim(),
      isLevelTest:false,
      students: marksArray.map((item) => ({
        student_name: item[0],
        mark: item[1] !== "" ? item[1] : null,
        remark: item[3] || "",
      })),
    };
  };
  
  const handleSave = () => {
    if (error || (testNames.includes(testName) && !isSaved)) {
      setError("Cannot save. Test name already exists.");
      return;
    }
  
    const formattedData = transformMarksData(testTableData, month, subject);
    console.log(JSON.stringify(formattedData, null, 2));
  
    axios
      .post(API_PATHS.POST_MARK, formattedData)
      .then((response) => {
        console.log("Marks data submitted successfully!", response.data);
        setIsSaved(true);
        setTestId(response.data.test_detail_id)
      })
      .catch((error) => {
        console.error("Error submitting marks data:", error.response.data);
        alert('Something went wrong. Try again later.','error')
      });
  };
  
  const handleUpdate = () => {
    const formattedData = transformMarksData(testTableData, month, subject);
    console.log(JSON.stringify(formattedData, null, 2));
  
    axios
      .put(`${API_PATHS.UPDATE_MARK}${testId}/`, formattedData)
      .then((response) => {
        console.log("Marks data updated successfully!", response.data);
        setIsUpdated((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error submitting marks data:", error.message);
        alert('Something went wrong. Try again later.',"error")
      });
  };
  

  const handleDataChange = useCallback(
    (changes) => {
      if (!changes) return;
      setTestTableData((prevData) => {
        const updatedData = [...prevData];
        changes.forEach(([row, col, , newValue]) => {
          updatedData[row][col] = newValue;
          if (col === 1) {
            updatedData[row][2] =
              newValue === "Absent" ? "Absent" : calculateMarksOutOf100(newValue);
          }
        });
        setIsEdited(true);
        return updatedData;
      });
    },
    [calculateMarksOutOf100]
  );

  const handleBeforeChange = (changes, source) => {
    if (!changes) return;
    let shouldCancelChange = false; // Flag to track whether to cancel the change
  
    for (let i = 0; i < changes.length; i++) {
      const [row, col, oldValue, newValue] = changes[i];
  
      if (col === 1) {
        if (newValue === "a" || newValue === "A") {
          changes[i][3] = "Absent";
          continue;
        }
        if (parseFloat(newValue) > totalMark) {
          alert('Enter mark less than or equal to total mark', 'error');
          shouldCancelChange = true;
        } else if (newValue < 0) {
          alert('Enter a positive number', 'error');
          shouldCancelChange = true;
        } else if (newValue !== "" && isNaN(newValue)) {
          alert('Only "a" or "A" are allowed!', 'error');
          shouldCancelChange = true;
        }
  
        if (shouldCancelChange) {
          // Cancel the change
          setTimeout(() => {
            const instance = hotTableRef.current.hotInstance;
            instance.selectCell(row, col); // Refocus the problematic cell
            instance.setDataAtCell(row, col, oldValue); // Reset to the old value
          }, 0);
          return false;
        }
  
        if (/^0\d+$/.test(newValue)) {
          changes[i][3] = newValue.replace(/^0+/, ""); // Remove leading zeros
          continue;
        }
      }
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
    td.classList.remove("cell-red", "cell-yellow", "cell-green");
    if (col === 2 && value !== "" && !isNaN(value)) {
      const numericValue = Math.round(parseFloat(value));
      if (numericValue <= categoryMark.redEndValue) {
        td.classList.add("cell-red");
      } else if (numericValue <= categoryMark.yellowEndValue
      ) {
        td.classList.add("cell-yellow");
      } else  {
        td.classList.add("cell-green");
      }
    }
    if(col==1||col==2) td.classList.add("cell-center")
    if (col === 2 && value === "Absent") td.classList.add("cell-absent");
    if (col === 0 || col === 1 || col === 3) td.classList.add("cell-names");
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
        const marks = row[1];
        if (marks !== "" && !isNaN(marks) && parseFloat(marks) > totalMark) {
          row[1] = "";
        }
        if (row[1] !== "" && row[1] !== "A") {
          row[2] = calculateMarksOutOf100(row[1]);
        } else {
          row[2] = "";
        }
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
        setIsArchived(response.data.test_detail.isArchived);
        setAboutTest(response.data.test_detail.about_test)
        setPreviousAboutTest(response.data.test_detail.about_test)
        setIsSaved(true);
        const parsedDate = dayjs(response.data.test_detail.created_at, "YYYY-MM-DD HH:mm:ss");
        setSelectedDate(parsedDate);
        
        return response.data.marks.map((row) => [
          row.student_name,
          row.mark,
          row.average_mark,
          row.remark,
        ]);
      } else {
        setTotalMark("");
        setPreviousTotalMark("");
        setTestName("");
        setPreviousTestName("");
        setIsArchived(false);
        setIsSaved(false);
        setSelectedDate( dayjs())
        setAboutTest("");
        setPreviousAboutTest("");
        console.log(dayjs());
        
        return response.data.map((name) => [name, "", "", ""]);
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

  const testAreaProps={aboutTest,setAboutTest,setIsEdited,previousAboutTest,isSaved}
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
            onClick={isSaved ? handleUpdate : handleSave}
            disabled={
              !!error ||
              !testName.trim() ||
              !section ||
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
    <TextArea {...testAreaProps} />

    </>
  );
}

export default TestTable;
