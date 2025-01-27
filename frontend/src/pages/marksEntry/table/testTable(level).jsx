import React, { useEffect, useCallback, useState,useRef,useMemo } from "react";
import axios from "axios";
import { Handsontable, HotTable } from "../../../utils/handsOnTableImports.js";
import {DemoContainer,AdapterDayjs,LocalizationProvider,DatePicker} from "../../../utils/dateImports.js"
import {dayjs} from "../../../utils/dateImports.js";
import {
  Box,
  Button,
  Typography,
  TextField,
  SaveIcon,
  RefreshIcon,Paper
} from "../../../utils/materialImports.js";
import API_PATHS from "../../../constants/apiPaths.js";
import TextArea from "./textArea.jsx";
import { testNameRegex,levelRegex } from "../../../constants/regex.js";
import ChartForLevel from '../charts/chartForLevelTable.jsx'
import '../marksEntry.css'

function LevelTestTable(props) {
    const {testId,section,month,subject,setTestId}=props
  
    const [testTableData, setTestTableData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [testName, setTestName] = useState("");
    const [previousTestName, setPreviousTestName] = useState("");
    const [testNames, setTestNames] = useState([]);
    const [error, setError] = useState(""); 
    const [isSaved, setIsSaved] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [aboutTest, setAboutTest] = useState('');
    const [previousAboutTest,setPreviousAboutTest]=useState('')
    const hotTableRef = useRef(null);
    
    
  const testTableColumns = [
    { title: "Student", width: 200, readOnly: true },
    { title: "Level", width: 100,editor: "text" },
    { title: "Remark", width: 100 },
  ]

  const transformMarksData = (marksArray, month, subject) => {
    return {
      month: month,
      subject: subject,
      test_name: testName.trim(),
      section: section,
      total_marks: 0,
      created_at: selectedDate,
      about_test:aboutTest.trim(),
      isLevelTest:true,
      batch:4,
      students: marksArray.map((item) => ({
        student_name: item[0],
        level:item[1]!==""?item[1]:null,
        remark: item[2] || "",
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
      .post(API_PATHS.POST_LEVEL, formattedData)
      .then((response) => {
        console.log("Marks data submitted successfully!", response.data);
        setIsSaved(true);
        setTestId(response.data.test_detail_id)
        console.log(response.data.test_detail_id);
        
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
      .put(`${API_PATHS.UPDATE_LEVEL}${testId}/`, formattedData)
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
        });
        setIsEdited(true);
        return updatedData;
      });
    },
    []
  );

  const handleBeforeChange = (changes, source) => {
    if (!changes) return;
  
    for (let i = 0; i < changes.length; i++) {
      const [row, col, oldValue, newValue] = changes[i];

      if (col == 1) {
        if (levelRegex.test(newValue)||newValue==""||!newValue) {
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
      setError("");
      setIsEdited(false);
    } catch (error) {
      console.error("Error in handleReset:", error);
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
        ? `${API_PATHS.GET_LEVEL}${testId}/`
        : `${API_PATHS.GET_STUDENTS_NAME}?section=${section}`;

      const response = await axios.get(apiUrl);
      if (testId) {
        setTestName(response.data.test_detail.test_name);
        setPreviousTestName(response.data.test_detail.test_name);
        setAboutTest(response.data.test_detail.about_test)
        setPreviousAboutTest(response.data.test_detail.about_test)
        setIsSaved(true);
        const parsedDate = dayjs(response.data.test_detail.created_at, "YYYY-MM-DD HH:mm:ss");
        setSelectedDate(parsedDate);
        console.log(response.data.marks);
        return response.data.marks.map((row) => [
          row.student_name,
          row.level,
          row.remark,
        ]);
      } else {
        setTestName("");
        setPreviousTestName("");
        setIsSaved(false);
        setSelectedDate( dayjs())
        setAboutTest("");
        setPreviousAboutTest("");
        
        return response.data.map((name) => [name, "", ""]);
      }
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
      if(col==1) td.classList.add("cell-center")
      if (col === 0 || col === 1 || col === 2) td.classList.add("cell-names");
    };
  

  useEffect(() => {
    (async () => {
      try {
        const initialData = await fetchData();
        setTestTableData(initialData);
        
        
        console.log(initialData);
        
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    })();
  }, [testId]);

  const testAreaProps={aboutTest,setAboutTest,setIsEdited,previousAboutTest,isSaved}
  const chartProps={testTableData}
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
              !isEdited
            }
            sx={{ marginLeft: 1 }}
          >
            {isSaved ? "Update" : "Save"}
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
    <Paper elevation={3} sx={{ padding: 2, width: "100%", maxWidth: "1000px" }}>
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
    </Paper>
    <Box sx={{ width: "20%", marginTop: 2 }}>  
    <ChartForLevel {...chartProps} />
    </Box>
  </Box>
    <TextArea {...testAreaProps} />

    </>
  );
}

export default LevelTestTable;
