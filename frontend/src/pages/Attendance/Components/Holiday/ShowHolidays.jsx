import React, { useState, useEffect,useContext } from "react";
import {
  Drawer,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { validReasonRegex } from "../../../../constants/regex";
import useAttendanceContext from "../../../../Context/AttendanceContext";
import { addHoliday, fetchHolidays } from "../../../../api/attendanceAPI";


const SideBarForHoliday = () => {
  const { sectionId,loading,setLoading} = useAttendanceContext();

  const [holidays, setHolidays] = useState([]);
   const [tableVisible, setTableVisible] = useState(false);

  const getHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidays()
      setHolidays(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch holidays.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableVisible) getHolidays();
  }, [tableVisible]);

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "day", headerName: "Day", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 5, editable: true },
  ];
  

  const rows = holidays.map((holiday, idx) => ({
    id: idx,
    date: holiday.date,
    day: holiday.day_of_week,
    reason: holiday.reason,
  }));

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    // Trim the reason before sending the data
const trimmedReason = newRow.reason.trim();

if (!validReasonRegex.test(trimmedReason)) {
  alert(
    "Reason must include at least one letter and can contain spaces, numbers, and common punctuation.",
    "error"
  );
  return oldRow; // Revert to the old value if validation fails
}

if (trimmedReason !== oldRow.reason) {
  try {
    let holidayData={
      section_id: sectionId,
      date: newRow.date,
      reason: trimmedReason,  // Use the trimmed reason
    }
    await addHoliday(holidayData)

    // Update the local holidays state
    setHolidays((prevHolidays) =>
      prevHolidays.map((holiday) =>
        holiday.date === newRow.date
          ? { ...holiday, reason: trimmedReason }
          : holiday
      )
    );

    alert("Holiday updated successfully.", "success");
  } catch (error) {
    console.error("Error updating holiday:", error);
    alert("Failed to update holiday.", "error");
    return oldRow; // Revert the change if update fails
  }
}
    return newRow;
  };

  return (
    <div>


      {tableVisible && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}

      {tableVisible && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            boxShadow: 3,
            padding: 3,
            borderRadius: 2,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => setTableVisible(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#d32f2f",
              color: "#fff",
              width: 25,
              height: 25,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            <Close />
          </IconButton>

          {loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
            rows={rows}
            columns={columns.map(col => ({ ...col, resizable: false }))}
            processRowUpdate={handleProcessRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            pagination={false}
            hideFooter={true} 
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              marginTop: "1rem",
            }}
          />
          )}
        </Box>
      )}
    </div>
  );
};

export default SideBarForHoliday;
