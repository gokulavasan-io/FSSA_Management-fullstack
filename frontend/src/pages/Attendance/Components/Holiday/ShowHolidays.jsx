import React, { useState, useEffect, useContext } from "react";
import { CircularProgress } from "@mui/material";
import { Close, Mode } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { validReasonRegex } from "../../../../constants/regex";
import useAttendanceContext from "../../../../Context/AttendanceContext";
import { addHoliday, fetchHolidays } from "../../../../api/attendanceAPI";
import { useMainContext } from "../../../../Context/MainContext";
import { Empty, Modal } from "antd";

const ShowHolidays = () => {
  const {
    monthId,
    loading,
    setLoading,
    holidaysTableVisible,
    setHolidaysTableVisible,
  } = useAttendanceContext();
  const { year, sectionId } = useMainContext();
  const [holidays, setHolidays] = useState([]);

  const getHolidays = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidays(sectionId, monthId, year);
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
    if (holidaysTableVisible) getHolidays();
  }, [holidaysTableVisible]);

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
        let holidayData = {
          section_id: sectionId,
          date: newRow.date,
          reason: trimmedReason, // Use the trimmed reason
        };
        await addHoliday(holidayData);

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
    <>
      <Modal
        open={holidaysTableVisible}
        onCancel={() => setHolidaysTableVisible(false)}
        footer={null}
        centered
        title={"Holidays"}
        zIndex={100003}
        width={1200}
      >
        {holidays.length == 0 ? (
          <Empty description="No Holidays Available" />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns.map((col) => ({ ...col, resizable: false }))}
            processRowUpdate={handleProcessRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            pagination={false}
            hideFooter={true}
            sx={{
              width: "100%",
              height: "600px",
              overflow: "hidden",
              marginTop: "1rem",
            }}
            loading={loading}
          />
        )}
      </Modal>
    </>
  );
};

export default ShowHolidays;
