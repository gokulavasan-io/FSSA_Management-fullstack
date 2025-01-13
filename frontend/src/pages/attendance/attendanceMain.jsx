import React, { useEffect, useState } from "react";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import AttendanceTable from "./attendanceTable";
import Sidebar from "./holidayReson";
import "dayjs/locale/en";
import Handsontable from "handsontable";
import { useSnackbar } from "../UxComponents/snackbar";
import AddRemark from "./addRemark";
import HolidayManager from "./markHoliday";
import { Button } from "@mui/material";
import CalendarPopup from "../uxComponents/calendar";

const Attendance = ({ year, month, sectionId }) => {
  const { openSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);


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
  




  return (
    <div>
      <h2>Attendance for {month}/{year}</h2>
      {/* Flex container for the three components */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button 
          variant="outlined"
          color="primary"
          onClick={handleUpdateAttendance}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Attendance"}
        </Button>
        <AddRemark students={tableData} year={year} month={month} />
        <HolidayManager
          tableData={tableData}
          setTableData={setTableData}
          year={year}
          month={month}
          sectionId={sectionId}
          statusOptions={statusOptions}
          handleUpdateAttendance={handleUpdateAttendance}
        />
      <CalendarPopup />
      </div>
  
      <AttendanceTable
        tableData={tableData}
        hotColumns={hotColumns}
        handleAfterChange={handleAfterChange}
      />
      
      <Sidebar year={year} month={month} sectionId={sectionId} />
    </div>
  );
  
  
};

export default Attendance;
