import React, { useEffect, useState } from "react";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import AttendanceTable from "./attendanceTable";
import Sidebar from "./remark";
import "dayjs/locale/en";
import Handsontable from "handsontable";
import AddRemark from "./addRemark";
import HolidayManager from "./markHoliday";

import { Button } from "@mui/material";
import CalendarPopup from "../uxComponents/calendar";

const Attendance = ({ year, month, sectionId }) => {
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState([]); // State variable to store fetched remarks


   const fetchStudentRemarks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_PATHS.FETCH_REMARKS}?year=${year || ""}&month=${month || ""}&section_id=${sectionId || ""}`
      );
      return response.data; // Return fetched remarks data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const daysCount = new Date(year, month, 0).getDate();
        const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
  
        const response = await axios.get(
          `${API_PATHS.ATTENDANCE_DATA}?year=${year || ""}&month=${month || ""}&section_id=${sectionId || ""}`
        );
  
        const { data, status } = response.data;
        const fetchedRemarks = await fetchStudentRemarks(); // Fetch remarks
        setRemarks(fetchedRemarks); // Store fetched remarks in the state
  
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
      alert("Attendance updated successfully!");
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
      source: statusOptions.filter((status) => status !== "Holiday"),
      allowInvalid: false,
      readOnly: tableData.some((row) => row[day] === "Holiday"),
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        const isHoliday = tableData[row]?.[day] === "Holiday";
        const isWeekend = [0, 6].includes(new Date(year, month - 1, day).getDay());
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Check if there's a remark for the student on this day
        const studentId = tableData[row]?.student_id;
        const remarkForThisDay = remarks.find((remark) =>
          remark.attendance.some(
            (attendance) =>
              attendance.date === date && remark.student_id === studentId
          )
        );    
  
        // If remark exists, highlight the cell
        if (remarkForThisDay) {
          td.classList.add("remarkCell");
        } 
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
