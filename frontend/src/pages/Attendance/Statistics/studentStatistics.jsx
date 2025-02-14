import React, { useEffect } from "react";
import { Table, Spin } from "antd";
import API_PATHS from "../../../constants/apiPaths";
import useAttendanceContext from "../AttendanceContext";

const AttendanceStatsTable = () => {
  const { sectionId, month, year, loading, setLoading, attendanceData, setAttendanceData, totalWorkingDays, setTotalWorkingDays } = useAttendanceContext();

  useEffect(() => {
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

  // Extract dynamic status counts
  const getStatusFields = () => {
    if (attendanceData.length === 0) return [];
    return Object.keys(attendanceData[0]?.status_counts || {});
  };
  
  // Generate dynamic columns
  const columns = [
    { title: "Student Name", dataIndex: "name", key: "name", fixed: "left", width: 250 },
    ...getStatusFields().map((status) => ({
      title: status.replace(/_/g, " "), // Format column name
      dataIndex: ["status_counts", status],
      key: status,
      sorter: (a, b) => (a.status_counts[status] || 0) - (b.status_counts[status] || 0),
      width: 120,align: "center",
    })),
    { title: "Total Score", dataIndex: "total_score", key: "total_score",align: "center", sorter: (a, b) => a.total_score - b.total_score, width: 120 },
    { 
      title: "Total Percentage", 
      dataIndex: "total_percentage", 
      key: "total_percentage", 
      align: "center", 
      width: 120,
      sorter: (a, b) => parseFloat(a.total_percentage) - parseFloat(b.total_percentage) // Convert string to number
    },
    { 
      title: "Present Percentage", 
      dataIndex: "present_percentage", 
      key: "present_percentage", 
      align: "center", 
      width: 120,
      sorter: (a, b) => parseFloat(a.present_percentage) - parseFloat(b.present_percentage) // Convert string to number
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Statistics</h1>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          <p>Total Working Days: {totalWorkingDays}</p>
          <Table
            dataSource={attendanceData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            bordered
            size="small"
          />
        </>
      )}
    </div>
  );
};

export default AttendanceStatsTable;
