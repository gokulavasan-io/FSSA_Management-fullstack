import React, { useEffect, useState } from "react";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import AttendanceTable from "./attendanceTable";
import Sidebar from "./remark";
import { DemoContainer, AdapterDayjs, LocalizationProvider, DatePicker } from "../../utils/dateImports";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Optional: Set the locale to en (English)
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,TextField,MenuItem } from '@mui/material'; 
import Handsontable from "handsontable";
import ConfirmationDialog from "../uxComponents/confirmationDialog";
import { useSnackbar } from "../UxComponents/snackbar";

const Attendance = ({ year, month, sectionId }) => {
    const { openSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHolidayDay, setSelectedHolidayDay] = useState(""); // State for selected day
  const [isHoliday, setIsHoliday] = useState(false); // State to track if the selected day is already marked as Holiday
  const [selectedDate, setSelectedDate] = useState(null); // Define the selectedDate state as null initially
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [holidayReason, setHolidayReason] = useState(""); // State to store holiday reason
  const [holidayReasonDialogOpen, setHolidayReasonDialogOpen] = useState(false); // State to manage dialog visibility
  

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const daysCount = new Date(year, month, 0).getDate();
        const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);

        const response = await axios.get(
          `${API_PATHS.ATTENDANCE_DATA}?year=${year || ""}&month=${month || ""}&section_id=${sectionId || ""}`
        );

        const { data, status } = response.data;

        const modifiedData = data.map((student) => {
          const row = { name: student.name, student_id: student.student_id };
          daysInMonth.forEach((day) => {
            row[`${day}`] = student[`${day}`]?.status || "";
          });
          return row;
        });

        setTableData(modifiedData);
        setStatusOptions(status); // E.g., ["P", "A", "L"]
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, [year, month, sectionId]);

  const handleAfterChange = (changes, source) => {
    if (source === "edit" && changes) {
      const newData = [...tableData];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (oldValue !== newValue) {
          newData[row][prop] = newValue;
        }
      });
      setTableData(newData);
    }
  };

  const handleUpdateAttendance = async () => {
    setLoading(true);

    const updatedRecords = tableData.map((row) => {
      const attendance = Object.keys(row)
        .filter((key) => !isNaN(Number(key)))
        .map((day) => ({
          day: Number(day),
          status: row[day] || ""
        }));

      return {
        student_id: row.student_id,
        year,
        month,
        attendance,
      };
    });

    try {
      await axios.put(API_PATHS.UPDATE_ATTENDANCE, { records: updatedRecords });
      openSnackbar("Attendance updated successfully!",'success');
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleHolidayToggle = () => {
    if (!selectedHolidayDay) {
      alert("Please select a day.");
      return;
    }
  
    const isCurrentlyHoliday = tableData.some(
      (row) => row[selectedHolidayDay] === "Holiday"
    );
  
    setIsHoliday(isCurrentlyHoliday); // Update the state to reflect the current status
    setOpenDialog(true); // Open the confirmation dialog
  };
  
  
  const handleHolidayConfirmation = async (confirm) => {
    setOpenDialog(false); // Close the dialog
  
    if (confirm) {
      if (isHoliday) {
        // Remove holiday - no reason needed
        try {
          await axios.delete(API_PATHS.ADD_HOLIDAY, {
            data: {
              date: selectedDate.format("YYYY-MM-DD"),
              section_id: sectionId,
            },
          });
          openSnackbar("Holiday removed successfully!",'success');
          toggleHolidayInTable(false); // Remove holiday status
        } catch (error) {
          console.error("Error removing holiday:", error);
          alert("Failed to remove holiday.");
        }
      } else {
        // Mark as holiday with a reason if necessary
        setHolidayReasonDialogOpen(true); // Open the reason dialog
      }
    }
  };
  
  
  
  

  
  const handleHolidayReasonSubmit = async () => {
    if (!holidayReason) {
      alert("Please provide a reason for the holiday.");
      return;
    }
  
    try {
      // Save the holiday and reason in the backend
      await axios.post(API_PATHS.ADD_HOLIDAY, {
        date: selectedDate.format("YYYY-MM-DD"),
        section_id: sectionId,
        reason: holidayReason,
      });
  
      openSnackbar("Holiday marked successfully!",'success');
      setHolidayReasonDialogOpen(false);  // Close the holiday reason dialog
      setHolidayReason("");  // Clear the holiday reason field
  
      // Mark the day as a holiday in the table
      toggleHolidayInTable(true);  // Update this function call to toggle the holiday status
    } catch (error) {
      console.error("Error marking holiday:", error);
      alert("Failed to mark holiday.");
    }
  };
  
  
  
  
  const toggleHolidayInTable = (markAsHoliday) => {
    const newData = [...tableData];
    newData.forEach((row) => {
      if (markAsHoliday) {
        row[selectedHolidayDay] = "Holiday"; // Mark as holiday
      } else {
        row[selectedHolidayDay] = ""; // Remove the holiday
      }
    });
  
    setTableData(newData); // Update table data
    handleUpdateAttendance()
  };
  
  

  // Check if the selected day is marked as Holiday
  const isHolidayDay = tableData.some((row) => row[selectedHolidayDay] === "Holiday");

  const daysCount = new Date(year, month, 0).getDate();
  const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);

  const hotColumns = [
    {
      data: "name",
      title: "Student Name",
      readOnly: true,
      width: 250,
    },
    ...daysInMonth.map((day) => ({
      data: `${day}`,
      title: `${day}/${month}`,
      type: "dropdown",
      source: statusOptions.filter(status => status !== "Holiday"),
      allowInvalid: false,
      readOnly: tableData.some(row => row[day] === "Holiday"),
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        const isHoliday = tableData[row]?.[day] === "Holiday";
        const isWeekend = [0, 6].includes(new Date(year, month-1, day).getDay());
 
        
        if (isHoliday && !isWeekend) {
          td.innerHTML = value;
          td.classList.remove("handsontableDropdown");
          td.classList.add("holidayCell");
        } else if (isWeekend) {
          td.innerHTML = value;
          td.classList.remove("handsontableDropdown");
          td.classList.add("weekendCell");
          
        } else {
          Handsontable.renderers.DropdownRenderer.apply(this, arguments); // Default dropdown renderer
        }
      },

    })),
  ];
  
 
  



  const handleAddRemark = () => {
    if (!selectedStudent || !selectedDate) {
      alert("Please select both student and date.");
      return;
    }
    setRemarkDialogOpen(true);
  };

  // Handle remark submission
  const handleRemarkSubmit = async () => {
    try {
      await axios.post(API_PATHS.ADD_REMARK, {
        student_id: selectedStudent,
        date: selectedDate.format("YYYY-MM-DD"),
        remark,
      });

      openSnackbar("Remark added successfully!",'success');
      setRemarkDialogOpen(false);
      setRemark(""); // Clear the remark field
    } catch (error) {
      console.error("Error adding remark:", error);
      alert("Failed to add remark.");
    }
  };




  const sideBarProps={year,month,sectionId}
  return (
    <div>
      <h2>Attendance for {month}/{year}</h2>

       {/* Dropdown for selecting student */}
       <TextField
        select
        label="Select Student"
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        sx={{ width: 200 }}
        variant="outlined"
      >
        {tableData.map((student) => (
          <MenuItem key={student.student_id} value={student.student_id}>
            {student.name}
          </MenuItem>
        ))}
      </TextField>
       {/* Button to open the remark dialog */}
       <Button
        variant="contained"
        color="primary"
        onClick={handleAddRemark}
      >
        Add Remark
      </Button>
       {/* Remark Dialog */}
       <Dialog open={remarkDialogOpen} onClose={() => setRemarkDialogOpen(false)}>
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <TextField
            label="Remark"
            multiline
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarkDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRemarkSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calendar input for selecting day (using Material-UI DatePicker with Day.js formatting) */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DatePicker']}>
    <DatePicker
      label="Select Holiday Day"
      value={selectedDate || null} // No value selected on page load
      onChange={(newValue) => {
        setSelectedDate(newValue); // Update the selected date
        setIsHoliday(false); // Reset Holiday flag when a new date is selected
        setSelectedHolidayDay(newValue?.date()); // Save the selected day for toggling holiday
        console.log('Selected Date:', newValue);
      }}
      format="DD/MM/YYYY"
      minDate={dayjs(new Date(year, month - 1, 1))} // Set the min date to the 1st day of the month
      maxDate={dayjs(new Date(year, month - 1, daysCount))} // Set the max date to the last day of the month
      shouldDisableDate={(date) => date.day() === 0 || date.day() === 6} // Disable Saturdays (6) and Sundays (0)
      slotProps={{
        textField: {
          size: 'small',
          sx: {
            width: 'auto',
          },
        },
      }}
    />
    {/* Disable button if no date is selected */}
    <Button
      variant="contained"
      color="primary"
      disabled={!selectedDate} // Disable button if no date is selected
      onClick={handleHolidayToggle}
    >
      {isHolidayDay ? 'Remove Holiday' : 'Mark as Holiday'}
    </Button>
  </DemoContainer>
</LocalizationProvider>


      <AttendanceTable
        tableData={tableData}
        hotColumns={hotColumns}
        handleAfterChange={handleAfterChange}
      />
      <button onClick={handleUpdateAttendance} disabled={loading}>
        {loading ? "Updating..." : "Update Attendance"}
      </button>
      <Sidebar {...sideBarProps} />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
  open={openDialog}
  onClose={handleHolidayConfirmation}  // Handle confirmation of holiday action
  title={isHoliday ? "Remove Holiday" : "Mark as Holiday"}
  content={isHoliday
    ? "Are you sure you want to mark this day as a working day?"
    : "Do you want to mark this day as a holiday?"}
  confirmText={isHoliday ? "Yes, Mark as Working Day" : "Yes, Mark as Holiday"}
  cancelText="No, Cancel"
/>


<Dialog open={holidayReasonDialogOpen} onClose={() => setHolidayReasonDialogOpen(false)}>
  <DialogTitle>Enter Holiday Reason</DialogTitle>
  <DialogContent>
    <TextField
      label="Reason"
      value={holidayReason}
      onChange={(e) => setHolidayReason(e.target.value)}
      fullWidth
      multiline
      rows={4}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setHolidayReasonDialogOpen(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleHolidayReasonSubmit} color="primary">
      Submit
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

export default Attendance;
