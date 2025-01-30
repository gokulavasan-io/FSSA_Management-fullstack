import React, { useEffect, useState,useContext } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import API_PATHS from "../../../constants/apiPaths";
import useAttendanceContext from "../AttendanceContext";

const AttendanceStatsTable = () => {
  const {sectionId,month,year,loading,setLoading,attendanceData,setAttendanceData,totalWorkingDays,setTotalWorkingDays} = useAttendanceContext();

  // let { sectionId, month, year }=props


  // const [attendanceData, setAttendanceData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [totalWorkingDays, setTotalWorkingDays] = useState(0);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_PATHS.FETCH_STUDENTSTATISTICS}?sectionId=${sectionId}&month=${month}&year=${year}`
        );
        const data = await response.json();
        setAttendanceData(data.students || []);
        setTotalWorkingDays(data.total_working_days || 0);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionId, month, year]);

  const columns = [
    { data: "name", title: "Student Name", readOnly: true },
    { data: "status_counts.Present", title: "Present", readOnly: true },
    { data: "status_counts.Absent", title: "Absent", readOnly: true },
    { data: "status_counts.Late Arrival", title: "Late Arrival", readOnly: true },
    { data: "status_counts.Approved Permission", title: "Approved Permission", readOnly: true },
    { data: "status_counts.Sick Leave", title: "Sick Leave", readOnly: true },
    { data: "status_counts.Casual Leave", title: "Casual Leave", readOnly: true },
    { data: "status_counts.Half leave", title: "Half Day Leave", readOnly: true },
    { data: "total_score", title: "Total Score", readOnly: true },
    { data: "total_percentage", title: "Total Percentage", readOnly: true },
    { data: "present_percentage", title: "Present Percentage", readOnly: true },
  ];

  const tableSettings = {
    data: attendanceData,
    colHeaders: columns.map((col) => col.title),
    columns: columns.map((col) => ({ data: col.data, readOnly: col.readOnly })),
    stretchH: "all",
    width: "100%",
    height: "auto",
    rowHeaders: true,
    columnSorting: true, // Enable sorting
    licenseKey: "non-commercial-and-evaluation", // Free license for non-commercial use
    
  };

  return (
    <div>
      <h1>Attendance Statistics</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Total Working Days: {totalWorkingDays}</p>
          <HotTable
            data={attendanceData}
            colHeaders={columns.map((col) => col.title)}
            columns={columns.map((col) => ({
              data: col.data,
              readOnly: true, // Making all columns read-only
            }))}
            stretchH="all"
            width="100%"
            height="auto"
            rowHeaders={true}
            columnSorting={true} // Enable sorting
            licenseKey="non-commercial-and-evaluation" // Free license for non-commercial use
            fixedColumnsLeft={1} // Freeze the first column
            className="htCenter"
          />
        </>
      )}
    </div>
  );
  
};

export default AttendanceStatsTable;
