import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Paper, Typography, Grid } from '@mui/material';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';  // Import Handsontable styles
import API_PATHS from './apiPaths';
const App = () => {
  // State to store student names and marks data
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([]);

  // Fetch student names from the API
  useEffect(() => {
    axios.get(API_PATHS.GET_STUDENTS_NAME)
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
    console.log('Data to save:', data);
  };


  const columns = [
    { 
      title: 'Student', 
      width: 150, 
      readOnly: true, // Make the "Student" column read-only
    },
    { 
      title: 'Marks (Out of 50)', 
      width: 180, 
      editor: 'text', // Use the text editor for input
    },
    { 
      title: 'Marks (Out of 100)', 
      width: 180, 
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
      updatedData[row][2] = calculateMarksOutOf100(newValue);
    }
  });

  setData(updatedData); // Update the data state
};

const handleBeforeChange = () => {
  // No validation needed
  return;
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
        width="100%"
        height="800"
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleDataChange}
        beforeChange={handleBeforeChange} 
        rowHeaders={true}
        manualColumnResize={true}
        stretchH="all"
        contextMenu={true}
      />

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            Save Marks
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
