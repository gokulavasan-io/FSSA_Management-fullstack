import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Menu, Close, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import ConfirmationDialog from "../uxComponents/confirmationDialog";
import { useSnackbar } from "../UxComponents/snackbar";
import { validRemarkRegex } from "../../constants/regex";

const Sidebar = (props) => {
  const { openSnackbar } = useSnackbar();
  const { year, month, sectionId } = props;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog visibility
  const [selectedRow, setSelectedRow] = useState(null); // Store the row to delete
  const [editedRemarks, setEditedRemarks] = useState([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchStudentRemarks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_PATHS.FETCH_REMARKS}?year=${year || ""}&month=${month || ""}&section_id=${sectionId || ""}`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableVisible) fetchStudentRemarks();
  }, [tableVisible]);

  const columns = [
    { field: "student_name", headerName: "Name", width: 280, disableColumnResize: true },
    { field: "date", headerName: "Date", width: 130, disableColumnResize: true },
    { field: "status", headerName: "Status", width: 120, disableColumnResize: true },
    {
      field: "remark",
      headerName: "Remark",
      width: 550,
      editable: true,
      disableColumnResize: true,
    },
    {
      field: "delete_remark",
      headerName: "Delete",
      width: 100,
      align: "right", // Ensure the delete button is always on the right
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => handleDeleteRemark(params.row)}
            color="error"
            sx={{ marginRight: 1 }}
          >
            <Delete />
          </IconButton>
        );
      },
    },
  ];

  const rows = Array.isArray(students)
    ? students.reduce((acc, student, idx) => {
        if (Array.isArray(student.attendance)) {
          student.attendance.forEach((attendance, attendanceIdx) => {
            acc.push({
              id: `${idx}-${attendanceIdx}`,
              student_id: student.student_id,
              student_name: student.student_name,
              date: attendance.date,
              status: attendance.status,
              remark: attendance.remark || "No remark",
            });
          });
        }
        return acc;
      }, [])
    : [];

  const handleDeleteRemark = (row) => {
    setSelectedRow(row); // Store the selected row to delete
    setDialogOpen(true);  // Open the confirmation dialog
  };

  const handleConfirmDelete = async (confirmed) => {
    setDialogOpen(false);  // Close the dialog

    if (confirmed && selectedRow) {
      const { student_id, date } = selectedRow;

      try {
        const response = await axios.delete(API_PATHS.ADD_REMARK, {
          data: {
            student_id,
            date,
          },
        });

        openSnackbar((response.data.message || "Remark deleted successfully."),"success")
        
        // Remove the row from the students array
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            if (student.student_id === student_id) {
              student.attendance = student.attendance.filter(
                (attendance) => attendance.date !== date
              );
            }
            return student;
          }).filter(student => student.attendance.length > 0) // Remove student if they have no attendance
        );
      } catch (error) {
        console.error("Error deleting remark:", error);
        openSnackbar("Failed to delete remark.","error")

      }
    }
  };


  const handleProcessRowUpdate = (newRow, oldRow) => {
  
    if (newRow.remark !== oldRow.remark) {
      if (!validRemarkRegex.test(newRow.remark)) {
        openSnackbar("Remark must contain valid characters (letters, numbers, spaces only).", "error");
        return oldRow; // Reject the update and keep the old value
      }
  
      setEditedRemarks((prev) => {
        const existing = prev.find(
          (row) =>
            row.student_id === newRow.student_id && row.date === newRow.date
        );
        if (existing) {
          return prev.map((row) =>
            row.student_id === newRow.student_id && row.date === newRow.date
              ? { ...row, remark: newRow.remark }
              : row
          );
        }
        return [
          ...prev,
          { student_id: newRow.student_id, date: newRow.date, remark: newRow.remark },
        ];
      });
    }
    return newRow;
  };
  

  const handleUpdateRemarks = async () => {
    if (editedRemarks.length === 0) {
      openSnackbar("No changes to update.", "info");
      return;
    }
  
    try {
      const updatePromises = editedRemarks.map((row) =>
        axios.post(API_PATHS.ADD_REMARK, {
          student_id: row.student_id,
          date: row.date,
          remark: row.remark,
        })
      );
  
      await Promise.all(updatePromises);
  
      openSnackbar("Remarks updated successfully.", "success");
  
      // Update the students state in the UI
      setStudents((prevStudents) =>
        prevStudents.map((student) => ({
          ...student,
          attendance: student.attendance.map((attendance) => {
            const updatedRemark = editedRemarks.find(
              (edit) =>
                edit.student_id === student.student_id &&
                edit.date === attendance.date
            );
            return updatedRemark
              ? { ...attendance, remark: updatedRemark.remark }
              : attendance;
          }),
        }))
      );
  
      // Clear edited remarks after successful update
      setEditedRemarks([]);
    } catch (error) {
      console.error("Error updating remarks:", error);
      openSnackbar("Failed to update remarks.", "error");
    }
  };
  

  return (
    <div>
      {/* Floating Button to Open Sidebar */}
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

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderLeft: "1px solid #ddd",
            zIndex: 10000001,  // Ensure sidebar is above overlay
          },
        }}
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
      >
        {/* Close Button */}
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

        {/* Remarks Button */}
        <Box sx={{ marginTop: 8, textAlign: "center" }}>
        <Button
  variant="contained"
  color="primary"
  onClick={() => {
    setTableVisible((prev) => !prev);  // Toggle remarks table visibility
    setSidebarOpen(false);  // Close the sidebar
  }}
>
  {tableVisible ? "Hide Remarks" : "Show Remarks"}
</Button>

        </Box>
      </Drawer>

      {/* Grey Overlay */}
      {tableVisible && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",  // Semi-transparent grey
            zIndex: 999,  // Ensure overlay is below the sidebar
          }}
        />
      )}

      {/* Remarks Table */}
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
            zIndex: 1000,  // Ensure above overlay
          }}
        >
          <IconButton
            onClick={() => setTableVisible(false)}  // Close the table
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#d32f2f",  // Red color
              color: "#fff",
              width: 25,  // Smaller button size
              height: 25,  // Smaller button size
              "&:hover": { backgroundColor: "#b71c1c" },  // Darker red on hover
            }}
          >
            <Close />
          </IconButton>

          {loading ? (
            <CircularProgress />
          ) : (
            <><DataGrid
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateRemarks}
            disabled={editedRemarks.length === 0} 
            sx={{ marginTop: 2 }}
          >
            Update Remarks
          </Button></>
          )}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleConfirmDelete}
        title="Delete Remark"
        content="Are you sure you want to delete this remark? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Sidebar;
