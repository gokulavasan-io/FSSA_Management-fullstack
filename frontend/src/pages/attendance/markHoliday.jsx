import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import {
  DemoContainer,
  AdapterDayjs,
  LocalizationProvider,
  DatePicker,
} from "../../utils/dateImports";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";



const HolidayManager = ({ year, month, sectionId, tableData, setTableData }) => {
  

  const [selectedDate, setSelectedDate] = useState(null);
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");
  const [holidayReasonDialogOpen, setHolidayReasonDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const daysCount = new Date(year, month, 0).getDate();

  const checkIfHoliday = (date) => {
    const day = date.date();
    return tableData.some((row) => row[day] === "Holiday");
  };

  const toggleHolidayInTable = (day, markAsHoliday) => {
    const updatedData = tableData.map((row) => ({
      ...row,
      [day]: markAsHoliday ? "Holiday" : "",
    }));
    setTableData(updatedData);
  };
  

  const handleDateSelection = (newDate) => {
    setSelectedDate(newDate);
    const isCurrentlyHoliday = checkIfHoliday(newDate);
    setIsHoliday(isCurrentlyHoliday);
    setConfirmationDialogOpen(true);
  };

  const handleHolidayAction = async (confirm) => {
    if (!confirm) {
      setConfirmationDialogOpen(false);
      return;
    }

    const day = selectedDate.date();
    const formattedDate = selectedDate.format("YYYY-MM-DD");

    if (isHoliday) {
        try {
          await axios.delete(API_PATHS.ADD_HOLIDAY, {
            data: { date: formattedDate, section_id: sectionId },
          });
          toggleHolidayInTable(day, false);
          alert("Holiday removed successfully!", "success");
          setSelectedDate(null)
        } catch (error) {
          console.error("Error removing holiday:", error);
          alert("Failed to remove holiday.", "error");
        }
      }
      else {
      setHolidayReasonDialogOpen(true);
    }

    setConfirmationDialogOpen(false);
  };

  const handleHolidayReasonSubmit = async () => {
    if (!holidayReason) {
      alert("Please provide a reason for the holiday.");
      return;
    }

    const day = selectedDate.date();
    const formattedDate = selectedDate.format("YYYY-MM-DD");

    try {
        await axios.post(API_PATHS.ADD_HOLIDAY, {
          date: formattedDate,
          section_id: sectionId,
          reason: holidayReason,
        });
        toggleHolidayInTable(day, true);
        alert("Holiday marked successfully!", "success");
        setSelectedDate(null); // Reset the selected date
        setHolidayReason("");  // Reset the holiday reason
      } catch (error) {
        console.error("Error marking holiday:", error);
        alert("Failed to mark holiday.", "error");
      } finally {
        setHolidayReasonDialogOpen(false);
      }
      
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setConfirmationDialogOpen(true)}
      >
        Mark New Holiday
      </Button>

      <Dialog open={confirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
        <DialogTitle>
          {isHoliday ? "Remove Holiday" : "Mark as Holiday"}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateSelection}
                format="DD/MM/YYYY"
                minDate={dayjs(new Date(year, month - 1, 1))}
                maxDate={dayjs(new Date(year, month - 1, daysCount))}
                shouldDisableDate={(date) => date.day() === 0 || date.day() === 6}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: "auto" },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleHolidayAction(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleHolidayAction(true)} color="primary">
            {isHoliday ? "Remove Holiday" : "Mark as Holiday"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default HolidayManager;
