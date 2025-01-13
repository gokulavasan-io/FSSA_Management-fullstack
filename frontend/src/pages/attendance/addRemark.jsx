import React, { useState } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import API_PATHS from "../../constants/apiPaths";
import { useSnackbar } from "../UxComponents/snackbar";
import { AdapterDayjs, LocalizationProvider, DatePicker } from "../../utils/dateImports";



const AddRemark = ({ students, year, month }) => {
  const { openSnackbar } = useSnackbar();
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [remark, setRemark] = useState("");

  // Handle the dialog open/close state
  const handleOpenRemarkDialog = () => setRemarkDialogOpen(true);
  const handleCloseRemarkDialog = () => {
    setRemarkDialogOpen(false);
    setSelectedStudent("");
    setSelectedDate(null);
    setRemark("");
  };

  // Handle the remark submission
  const handleRemarkSubmit = async () => {
    if (!selectedStudent || !selectedDate || !remark) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post(API_PATHS.ADD_REMARK, {
        student_id: selectedStudent,
        date: selectedDate.format("YYYY-MM-DD"),
        remark,
      });

      openSnackbar("Remark added successfully!", "success");
      handleCloseRemarkDialog(); // Close the dialog after submission
    } catch (error) {
      console.error("Error adding remark:", error);
      alert("Failed to add remark.");
    }
  };

  return (
    <div>
      {/* Button to open the dialog */}
      <Button variant="contained" color="primary" onClick={handleOpenRemarkDialog}>
        Add Remark
      </Button>

      {/* Remark Dialog */}
      <Dialog open={remarkDialogOpen} onClose={handleCloseRemarkDialog}>
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          {/* Dropdown for selecting student */}
          <TextField
            select
            label="Select Student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            fullWidth
            margin="normal"
          >
            {students.map((student) => (
              <MenuItem key={student.student_id} value={student.student_id}>
                {student.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Date picker for selecting date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              format="DD/MM/YYYY"
              shouldDisableDate={(date) => date.day() === 0 || date.day() === 6}
              minDate={dayjs(new Date(year, month - 1, 1))} // Minimum date is the first day of the month
              maxDate={dayjs(new Date(year, month - 1, new Date(year, month, 0).getDate()))} // Maximum date is the last day of the month
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          {/* Input box for remark */}
          <TextField
            label="Remark"
            multiline
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseRemarkDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRemarkSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddRemark;
