import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Box, Paper, Typography,IconButton, TextField, } from '@mui/material';
import { Save as SaveIcon,Refresh as RefreshIcon} from '@mui/icons-material';

import Sidebar from './sidebarformark.jsx'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import API_PATHS from './apiPaths';
import { categoryMark } from './constValues';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [section, setSection] = useState('A');
  const [totalMark, setTotalMark] = useState("");
  const [previousTotalMark, setPreviousTotalMark] = useState('');
  const [testName,setTestName]=useState('')
  const [previousTestName, setPreviousTestName] = useState('');
  const [testId, setTestId] = useState(null);
  const [testNames, setTestNames] = useState([]);
  const [error, setError] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [isArchivedStatusChanged, setIsArchivedStatusChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isMainTable, setIsMainTable] = useState(true);
  const [testDetails, setTestDetails] = useState([]);
  const [mainTableData, setMainTableData] = useState([])
  const [mainTableColumns, setMainTableColumns] = useState([])
  const [showMainTableColor, setShowMainTableColor] = useState(false)
  

  const month = "January";
  const subject = "English";
  const columns = [
    { title: 'Student', width: 200, readOnly: true },
    { title: `Mark (out of ${totalMark})`, width: 100, editor: 'text' },
    { title: 'Mark (out of 100)', width: 100, readOnly: true },
    { title: 'Remark', width: 100 },
  ];

  const fetchData = async () => {
    try {
      const apiUrl = testId
        ? `${API_PATHS.GET_MARK}${testId}/`
        : `${API_PATHS.GET_STUDENTS_NAME}?section=${section}`;
      
      const response = await axios.get(apiUrl);
      if (testId) {
        setTotalMark(response.data.test_detail.total_marks);
        setPreviousTotalMark(response.data.test_detail.total_marks)
        setTestName(response.data.test_detail.test_name);
        setPreviousTestName(response.data.test_detail.test_name);
        setIsArchived(response.data.test_detail.isArchived)
        setIsSaved(true);
        return response.data.marks.map(row => [row.student_name, row.mark, row.average_mark, row.remark]);
      } else {
        setTotalMark('');
        setPreviousTotalMark('')
        setTestName('');
        setPreviousTestName('')
        setIsArchived(false)
        setIsSaved(false);
        return response.data.map(name => [name, '', '', '']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; 
    }
  };

  useEffect(()=>{
    setIsEdited(false)
  },[testId,isSaved,isUpdated])
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const initialData = await fetchData();
        setData(initialData);
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };
  
    loadData();
  }, [testId]);
  
  const handleReset = async () => {
    try {
      const initialData = await fetchData();
      setData(initialData);
      setError('');
      setIsEdited(false)
    } catch (error) {
      console.error('Error in handleReset:', error);
    }
  };


  useEffect(() => {
    if (section && month) {
      axios
        .get(`${API_PATHS.GET_ALL_DATA}?section=${section}&month=${month}&subject=${subject}`)
        .then((response) => {          
          setTestDetails(response.data.test_details || []);
          setTestNames(response.data.test_details.map(test=>test.test_detail.test_name))
          mainTableCreate(response.data)
          setIsArchivedStatusChanged(false)
        })
        .catch((error) => {
          console.error('Error fetching test names:', error);
        });
        
    }
  }, [isSaved,isMainTable,isArchivedStatusChanged,isUpdated]);

  // Calculate Marks out of 100
  const calculateMarksOutOf100 = (marks) => {
    if(!marks) return ""
    if (marks === '' || isNaN(marks) || marks === 'A') return '';
    return ((parseFloat(marks) / totalMark) * 100).toFixed(2);
  };

  const handleSave = () => {
    if (error || testNames.includes(testName) && !isSaved) {
      setError('Cannot save. Test name already exists.');
      return;
    }

    function transformMarksData(marksArray, month, subject) {
      return {
        month: month,
        subject: subject,
        test_name: testName,
        section: section,
        total_marks: totalMark,
        isArchived: isArchived,
        students: marksArray.map(item => ({
          student_name: item[0],
          mark: item[1] !== "" ? item[1] : 0.0,
          average_mark: item[2] !== "" ? item[2] : 0.0,
          remark: item[3] || "",
        })),
      };
    }

    const formattedData = transformMarksData(data, month, subject);
    console.log(JSON.stringify(formattedData, null, 2));

    axios.post(API_PATHS.POST_MARK, formattedData)
      .then(response => {
        console.log("Marks data submitted successfully!", response.data);
        setIsSaved(true);
      })
      .catch(error => {
        console.error("Error submitting marks data:", error.response.data);
      });
  };
  const handleUpdate = () => {

    function transformMarksData(marksArray, month, subject) {
      return {
        month: month,
        subject: subject,
        test_name: testName.trim(),
        section: section,
        total_marks: totalMark,
        isArchived: isArchived,
        students: marksArray.map(item => ({
          student_name: item[0],
          mark: item[1] !== "" ? item[1] : 0.0,
          average_mark: item[2] !== "" ? item[2] : 0.0,
          remark: item[3] || "",
        })),
      };
    }
    const formattedData = transformMarksData(data, month, subject);
    console.log(JSON.stringify(formattedData, null, 2));

    axios.put(`${API_PATHS.UPDATE_MARK}${testId}/`, formattedData)
      .then(response => {
        console.log("Marks data updated successfully!", response.data);
        setIsUpdated(prev=>!prev)
      })
      .catch(error => {
        console.error("Error submitting marks data:", error.message);
      });
  };

 


  const handleDataChange = useCallback((changes) => {
    if (!changes) return;
    setData((prevData) => {
      const updatedData = [...prevData];
      changes.forEach(([row, col, , newValue]) => {
        updatedData[row][col] = newValue;
        if (col === 1) {
          updatedData[row][2] = newValue === "A" ? "Absent" : calculateMarksOutOf100(newValue);
        }
      });
      setIsEdited(true)
      return updatedData;
    });
  }, [calculateMarksOutOf100]);
  

  const handleBeforeChange = (changes) => {
    if (!changes) return;
    for (let i = 0; i < changes.length; i++) {
      const [row, col, oldValue, newValue] = changes[i];
      if (col === 1) {
        if (newValue === 'a' || newValue === "A") {
          changes[i][3] = 'A';
          continue;
        }
        if (newValue !== '' && (isNaN(newValue) || parseFloat(newValue) > totalMark || newValue<0)) {
          return false;
        }
      }
    }
  };
 

  const cellRenderer = function (instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.classList.remove('cell-red', 'cell-yellow', 'cell-green');
    if (col === 2 && value !== '' && !isNaN(value)) {
      const numericValue = parseFloat(value);
      if (numericValue <= categoryMark.redEndValue) {
        td.classList.add('cell-red');
      } else if (numericValue >= categoryMark.yellowStartValue && numericValue <= categoryMark.yellowEndValue) {
        td.classList.add('cell-yellow');
      } else if (numericValue >= categoryMark.greenStartValue) {
        td.classList.add('cell-green');
      }
    }
    if (col === 2 && value === "Absent") td.classList.add('cell-absent');
    if (col === 0 || col === 1 || col === 3) td.classList.add('cell-names');
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
    const formattedInput = input.charAt(0).toUpperCase() + input.slice(1);
    setTestName(formattedInput);
    if (testNames.includes(formattedInput) && (!isSaved || (isSaved && formattedInput !== previousTestName))) {
      setError('Test name already exists.');
    }
    else {
      setError('');
      setIsEdited(true)
    }
    if(previousTestName==formattedInput && isSaved) setIsEdited(false)
  };
  
  
  const handleStartEditingTestName = () => {
    if (isSaved) {
      setPreviousTestName(testName); 
    }
  };
  

  const handleTotalMarkKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  
      const updatedData = data.map((row) => {
        const marks = row[1]; 
        if (marks !== '' && !isNaN(marks) && parseFloat(marks) > totalMark) {
          row[1] = ''; 
        }
        if (row[1] !== '' && row[1] !== 'A') {
          row[2] = calculateMarksOutOf100(row[1]);  
        } else {
          row[2] = ''; 
        }
        return row;
      });
  
      setData(updatedData); 
      event.target.blur();

    }
  };

  const handleKeyPress=(event)=>{
    if (event.key === 'Enter') {
      event.preventDefault(); 
      event.target.blur();
    }
  }


  

  const handleOptionClick = ( testId) => {
    setTestId(testId);
    setIsMainTable(false)
  };
  

  function mainTableCreate(fullData){

    setMainTableColumns(()=>{
        let columnData=[
          { title: 'Student', width: 200, readOnly: true },
          { title: 'Average mark', width: 100,readOnly: true },
        ];
        
        fullData.test_details.forEach(test=>{
          if (!test.test_detail.isArchived) {
            columnData.push({title:test.test_detail.test_name,width:100,readOnly:true})
          }
        })
        return columnData;
    })
    setMainTableData(fullData.student_avg_marks)
  }

  const cellRendererForMainTable = function (instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.classList.remove('cell-red', 'cell-yellow', 'cell-green');
    if (showMainTableColor) {
      if (col > 0 && value !== '' && !isNaN(value)) {
        const numericValue = parseFloat(value);
        if (numericValue <= categoryMark.redEndValue) {
          td.classList.add('cell-red');
        } else if (numericValue >= categoryMark.yellowStartValue && numericValue <= categoryMark.yellowEndValue) {
          td.classList.add('cell-yellow');
        } else if (numericValue >= categoryMark.greenStartValue) {
          td.classList.add('cell-green');
        }
      }
      if (col > 0 && value === "Absent") td.classList.add('cell-absent');
      if (col === 0) td.classList.add('cell-names');
    }else{
      if (col >=0) td.classList.add('cell-names');
    }
    
    if (col>0) td.classList.add('cell-center')
  };

  const handleColorButtonClick = () => {
    setShowMainTableColor(!showMainTableColor); 
  };



  const sidebarProps = {
    onOptionClick: handleOptionClick,testDetails,setTestDetails,setIsMainTable,setIsArchivedStatusChanged
  };
  return (
    <>
     <DndProvider backend={HTML5Backend}>
            <Sidebar {...sidebarProps} />    
      </DndProvider>
      
    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 2, width: '100%', maxWidth: '1000px' }}>
        {!isMainTable&&<Typography variant="h5" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="primary">
          <div>{testName?testName:"New Test Name"}</div>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
              size="small"
              startIcon={<RefreshIcon />} 
              variant="contained"
              onClick={handleReset}
              disabled={!isEdited}
              sx={{ backgroundColor: '#ff4c4c', '&:hover': { backgroundColor: '#ff0000' }}}  
            >
              Reset
            </Button>

            <Button
              size="small"
              color={isSaved ? "primary" : "success"}  
              startIcon={isSaved ? <SaveIcon /> : <SaveIcon />}
              variant="contained"
              onClick={isSaved ? handleUpdate : handleSave}
              disabled={!!error || !testName.trim() || !section || !month || !totalMark || !isEdited}
              sx={{ marginLeft: 1 }}  
            >
              {isSaved ? "Update" : "Save"}  
            </Button>

            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '8ch' } }} noValidate autoComplete="off">
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
            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '8ch' } }} noValidate autoComplete="off">
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
          </Box>
        </Typography>}
        {!isMainTable&&<HotTable
          data={data}
          colHeaders={columns.map((col) => col.title)}
          columns={columns}
          width="100%"
          height="auto"
          autoRowSize={true}
          licenseKey="non-commercial-and-evaluation"
          afterChange={handleDataChange}
          beforeChange={handleBeforeChange}
          rowHeaders={true}
          stretchH="all"
          cells={(row, col) => {
            return { renderer: cellRenderer };
          }}
        />}
        {isMainTable&& mainTableColumns.length>2 &&
         <>

      <Typography variant="h5" sx={{ marginBottom: 2,height:"3rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="primary">
        <div>{subject} - {month}</div>
      <Button
              size="small"
              variant="contained"
              onClick={handleColorButtonClick}
              sx={{ backgroundColor: '#ff4c4c', '&:hover': { backgroundColor: '#ff0000' }}}  
            >
              {showMainTableColor ? 'Hide color' : 'Show color'}
        </Button>
          </Typography>
         
        <HotTable
          data={mainTableData}
          colHeaders={mainTableColumns.map((test)=>test.title)}
          columns={mainTableColumns}
          width="100%"
          height="auto"
          autoRowSize={true}
          licenseKey="non-commercial-and-evaluation"
          rowHeaders={true}
          stretchH="all"
          cells={(row, col) => {
            return { renderer: cellRendererForMainTable };
          }}
        />

        </>
         }
         {
          isMainTable&&mainTableColumns.length<3&&
          <Typography variant="h5" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} color="primary">
          <div>No tests added yet</div>
          </Typography>
         }


      </Paper>


    </Box></>
  );
};

export default App;
