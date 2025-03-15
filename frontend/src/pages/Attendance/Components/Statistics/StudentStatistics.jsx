import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { fetchStudentStatistics } from "../../../../api/attendanceAPI";
import { useMainContext } from "../../../../Context/MainContext";
import useAttendanceContext from "../../../../Context/AttendanceContext";
import { Modal } from "antd";

const StudentStatistics = () => {
  const {
    monthId,
    loading,
    setLoading,
    studentStatisticsVisible,
    setStudentStatisticsVisible,
  } = useAttendanceContext();
  const { sectionId, year } = useMainContext();
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStudentStatistics(sectionId, monthId, year);
        setAttendanceData(response.students || []);
        setTotalWorkingDays(response.total_working_days || 0);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionId, monthId, year]);

  // Extract dynamic status counts
  const getStatusFields = () => {
    if (attendanceData.length === 0) return [];
    return Object.keys(attendanceData[0]?.status_counts || {});
  };

  // Generate dynamic columns
  const columns = [
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 250,
    },
    ...getStatusFields().map((status) => ({
      title: status.replace(/_/g, " "), // Format column name
      dataIndex: ["status_counts", status],
      key: status,
      sorter: (a, b) =>
        (a.status_counts[status] || 0) - (b.status_counts[status] || 0),
      width: 120,
      align: "center",
    })),
    {
      title: "Total Score",
      dataIndex: "total_score",
      key: "total_score",
      align: "center",
      sorter: (a, b) => a.total_score - b.total_score,
      width: 120,
    },
    {
      title: "Total Percentage",
      dataIndex: "total_percentage",
      key: "total_percentage",
      align: "center",
      width: 120,
      sorter: (a, b) =>
        parseFloat(a.total_percentage) - parseFloat(b.total_percentage), // Convert string to number
       render: (value) => `${value} %`,
    },
    {
      title: "Present Percentage",
      dataIndex: "present_percentage",
      key: "present_percentage",
      align: "center",
      width: 120,
      sorter: (a, b) =>
        parseFloat(a.present_percentage) - parseFloat(b.present_percentage), // Convert string to number
       render: (value) => `${value} %`,
    },
  ];

  return (
    <Modal
      open={studentStatisticsVisible}
      onCancel={() => setStudentStatisticsVisible(false)}
      footer={null}
      centered
      title={"Student Statistics"}
      zIndex={100003}
      width={1300}
    >
        <>
          <p>Total Working Days: {totalWorkingDays}</p>
          <Table
            dataSource={attendanceData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10,showSizeChanger: false }}
            scroll={{ x: "max-content" }}
            bordered
            size="small"
            footer={false}
            loading={loading}
          />
        </>
    </Modal>
  );
};

export default StudentStatistics;


