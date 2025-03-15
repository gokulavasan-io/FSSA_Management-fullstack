import React, { useState, useEffect } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialog from "../../../Components/ConfirmDialog";
import { validRemarkRegex } from "../../../../constants/regex";
import useAttendanceContext from "../../../../Context/AttendanceContext";
import {
  addRemark,
  deleteRemark,
  fetchRemarks,
} from "../../../../api/attendanceAPI";
import { useMainContext } from "../../../../Context/MainContext";
import { Empty, Modal } from "antd";
import { MdDelete } from "react-icons/md";
const ShowComments = () => {
  const {
    monthId,
    loading,
    setLoading,
    commentsTableVisible,
    setCommentsTableVisible,
  } = useAttendanceContext();
  const { year, sectionId } = useMainContext();
  const [students, setStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchStudentRemarks = async () => {
    setLoading(true);
    try {
      const response = await fetchRemarks(sectionId, monthId, year);
      setStudents(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (commentsTableVisible) fetchStudentRemarks();
  }, [commentsTableVisible]);

  const columns = [
    {
      field: "student_name",
      headerName: "Name",
      flex: 2,
      resizable: false,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      resizable: false,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      resizable: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      flex: 2,
      editable: true,
      resizable: false,
    },
    {
      field: "delete_remark",
      headerName: "Delete",
      flex: 0.5,
      align: "right",
      resizable: false,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => handleDeleteRemark(params.row)}
            color="error"
            sx={{ marginRight: 2 }}
          >
            <MdDelete size={22} />
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
              status: attendance.status__status || "No status",
              remark: attendance.remark || "No remark",
            });
          });
        }
        return acc;
      }, [])
    : [];

  const handleDeleteRemark = (row) => {
    setSelectedRow(row); // Store the selected row to delete
    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = async (confirmed) => {
    setDialogOpen(false); // Close the dialog

    if (confirmed && selectedRow) {
      const { student_id, date } = selectedRow;

      try {
        let remarkData = { student_id, date };
        await deleteRemark(remarkData);
        alert("Remark deleted successfully.");

        setStudents((prevStudents) =>
          prevStudents
            .map((student) => ({
              ...student,
              attendance: student.attendance.filter(
                (attendance) => attendance.date !== date
              ),
            }))
            .filter((student) => student.attendance.length > 0)
        );
      } catch (error) {
        console.error("Error deleting remark:", error);
        alert("Failed to delete remark.", "error");
      }
    }
  };

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    // Trim the remark before any processing
    const trimmedRemark = newRow.remark.trim();

    if (trimmedRemark !== oldRow.remark) {
      if (!validRemarkRegex.test(trimmedRemark)) {
        alert(
          "Remark must contain valid characters (letters, numbers, spaces only).",
          "error"
        );
        return oldRow; // Reject the update and keep the old value
      }

      try {
        let remarkData = {
          student_id: newRow.student_id,
          date: newRow.date,
          remark: trimmedRemark,
        };

        await addRemark(remarkData);
        alert("Remark updated successfully.", "success");

        // Update the students state locally
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            if (student.student_id === newRow.student_id) {
              return {
                ...student,
                attendance: student.attendance.map((attendance) =>
                  attendance.date === newRow.date
                    ? { ...attendance, remark: trimmedRemark } // Update with trimmed remark
                    : attendance
                ),
              };
            }
            return student;
          })
        );

        return newRow; // Accept the updated row
      } catch (error) {
        console.error("Error updating remark:", error);
        alert("Failed to update remark.", "error");
        return oldRow; // Revert to the old value in case of an error
      }
    }

    return newRow; // If remark is unchanged, simply accept the new row
  };

  return (
    <>
      <Modal
        open={commentsTableVisible}
        onCancel={() => setCommentsTableVisible(false)}
        footer={null}
        centered
        title={"Comments"}
        zIndex={100003}
        width={1200}
      >
        {students.length == 0 ? (
          <Empty description="No Comments Available" />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pagination={false}
            hideFooter={true}
            processRowUpdate={handleProcessRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            sx={{
              width: "100%",
              height: "500px",
              overflow: "hidden",
              marginTop: "1rem",
            }}
            loading={loading}
            onProcessRowUpdateError={(error) => {
              console.error("Error processing row update:", error);
              alert("Error updating remark. Please try again.", "error");
            }}
          />
        )}
      </Modal>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleConfirmDelete}
        title="Delete Remark"
        content="Are you sure you want to delete this remark? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ShowComments;
