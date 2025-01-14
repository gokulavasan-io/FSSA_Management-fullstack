import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import { validReasonRegex } from "../../constants/regex";


const Sidebar = (props) => {
  const { year, month, sectionId } = props;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_PATHS.FETCH_HOLIDAYS}?year=${year || ""}&month=${
          month || ""
        }&section_id=${sectionId || ""}`
      );
      setHolidays(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch holidays.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableVisible) fetchHolidays();
  }, [tableVisible]);

  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "day", headerName: "Day", width: 150 },
    { field: "reason", headerName: "Reason", width: 850, editable: true },
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
    await axios.post(API_PATHS.ADD_HOLIDAY, {
      section_id: sectionId,
      date: newRow.date,
      reason: trimmedReason,  // Use the trimmed reason
    });

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
      {!sidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderLeft: "1px solid #ddd",
            zIndex: 10000001,
          },
        }}
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ marginTop: 8, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setTableVisible((prev) => !prev);
              setSidebarOpen(false);
            }}
          >
            {tableVisible ? "Hide Holidays" : "Show Holidays"}
          </Button>
        </Box>
      </Drawer>

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
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              processRowUpdate={handleProcessRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
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

export default Sidebar;
