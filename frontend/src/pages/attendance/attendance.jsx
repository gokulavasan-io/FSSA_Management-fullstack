import React, { useEffect, useRef, useState } from "react";
import { HotTable } from "@handsontable/react";
import axios from "axios";
import API_PATHS from "../../constants/apiPaths";
import "./attendance.css";

const AttendanceTable = ({ year, month, sectionId }) => {
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const hotTableRef = useRef(null);

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
          status: row[day] || "",
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
      width: 200,
    },
    ...daysInMonth.map((day) => ({
      data: `${day}`,
      title: `Day ${day}`,
      type: "dropdown",
      source: statusOptions,
      allowInvalid: false,
    })),
  ];

  return (
    <div>
      <h2>Attendance for {month}/{year}</h2>
      <HotTable
        ref={hotTableRef}
        data={tableData}
        colHeaders={hotColumns.map((col) => col.title)}
        columns={hotColumns}
        rowHeaders
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        fixedColumnsLeft={1}
        afterChange={handleAfterChange}
      />
      <button onClick={handleUpdateAttendance} disabled={loading}>
        {loading ? "Updating..." : "Update Attendance"}
      </button>
    </div>
  );
};

export default AttendanceTable;
