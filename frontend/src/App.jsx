import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button, Box, Paper, Typography, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';  // Import Handsontable styles
import API_PATHS from './apiPaths';
import './App.css'


const App = () => {
  // State to store student names and marks data
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([]);

    const month = "January";
    const subject = "English";
    const testName="weekly 3";
    const section="A"
    const isArchived=true
    const totalMarks=87;

  // Fetch student names from the API
  useEffect(() => {
    axios.get(`${API_PATHS.GET_STUDENTS_NAME}?section=A`)
      .then((response) => {
        const studentNames = response.data;  // Assuming API returns an array of names
        const initialData = studentNames.map(name => [name, '', '', '']);  // Initialize the table with student names
        setStudents(studentNames);
        setData(initialData);
      })
      .catch((error) => {
        console.error('Error fetching student names:', error);
      });
  }, []);

  // Calculate Marks out of 100
  const calculateMarksOutOf100 = (marks) => {
    if (marks === '' || isNaN(marks) || marks === 'A') return '';
    return ((parseFloat(marks) / 50) * 100).toFixed(2);
  };
  const handleSave = () => {
  
    function transformMarksData(marksArray, month, subject) {
      return {
        month: month,
        subject: subject,
        test_name: testName,
        section: section,
        total_marks: totalMarks,
        isArchived: isArchived,
        students: marksArray.map(item => ({
        student_name: item[0],
        mark: item[1] !== "" ? item[1] : 0.0, // Convert empty string to 0.0
        average_mark: item[2] !== "" ? item[2] : 0.0, // Convert empty string to 0.0
        remark: item[3] || "", // Keep empty string for remark if not provided
    })),
      };
    }
    
    // Example Usage
    
    
    const formattedData = transformMarksData(data, month, subject);
    console.log(JSON.stringify(formattedData, null, 2));
  axios.post(API_PATHS.POST_MARKS, formattedData)
  .then(response => {
    console.log("Marks data submitted successfully!", response.data);
  })
  .catch(error => {
    console.error("Error submitting marks data:", error.response.data);
  });
  };


  const columns = [
    { 
      title: 'Student', 
      width: 200, 
      readOnly: true, // Make the "Student" column read-only
    },
    { 
      title: `Mark (out of ${totalMarks})`, 
      width: 100, 
      editor: 'text', // Use the text editor for input
    },
    { 
      title: 'Mark (out of 100)', 
      width: 100, 
      readOnly: true, // This column is calculated
    },
    { 
      title: 'Remark', 
      width: 200, 
    },
  ];
  
  

const handleDataChange = (changes) => {
  if (!changes) return;

  const updatedData = [...data];
  changes.forEach(([row, col, oldValue, newValue]) => {
    updatedData[row][col] = newValue;

    // If marks are updated, calculate the marks out of 100
    if (col === 1) {
      if (newValue=="A") updatedData[row][2]="Absent";
      else updatedData[row][2] = calculateMarksOutOf100(newValue);
    }

  });

  setData(updatedData); // Update the data state
};

const handleBeforeChange = (changes) => {
  if (!changes) return;

  const totalMarks = 50; // Set the maximum marks for validation

  for (let i = 0; i < changes.length; i++) {
    const [row, col, oldValue, newValue] = changes[i];

    // Only validate the 'Marks (Out of 50)' column
    if (col === 1) {
      // Allow alphabet 'a' or 'A' only, and change 'a' to 'A'
      if (newValue === 'a'||newValue==="A") {
        changes[i][3] = 'A'; // Change new value to 'A'
        continue; // Skip other validations for this case
      }

      if (newValue !== '' && (isNaN(newValue) || parseFloat(newValue) > totalMarks)) {
        return false; // Reject the change
      }
    }
  }
};

const cellRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  // Apply the default renderer
  Handsontable.renderers.TextRenderer.apply(this, arguments);

  // Remove any previous color classes
  td.classList.remove('cell-red', 'cell-yellow', 'cell-green');
  td.classList.add("cell-center");

  // Add color classes based on value for column 2 (Marks Out of 100)
  if (col === 2 && value !== '' && !isNaN(value)) {
    const numericValue = parseFloat(value);
    if (numericValue <= 50) {
      td.classList.add('cell-red');  // Apply the red class
    } else if (numericValue > 50 && numericValue <= 80) {
      td.classList.add('cell-yellow');  // Apply the yellow class
    } else if (numericValue > 80) {
      td.classList.add('cell-green');  // Apply the green class
    }
  }

};



return (
  <Box sx={{ padding: 3 }}>
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 3 }} color="primary">
        Marks Entry Table
      </Typography>

      <HotTable
        data={data}
        colHeaders={columns.map((col) => col.title)}
        columns={columns}
        width="50%"
        height="800"
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleDataChange}
        beforeChange={handleBeforeChange} 
        rowHeaders={true}
        manualColumnResize={true}
        stretchH="all"
        contextMenu={true}
        cells={(row, col) => {
          return col === 2||col==1 ? { renderer: cellRenderer } : {}; // Apply custom renderer for "Marks (Out of 100)" column
        }}
      />

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6}>
        <Button
          size="small"
          color="success"
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={()=>handleSave()}
        >
          Save
        </Button>

        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setData(data)}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

};

export default App;
