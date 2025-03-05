import React, { useEffect, useState } from "react";
import { Card, Row, Typography, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchAttendanceReport } from "../../../../api/homeAPI";
import { useMainContext } from "../../../../Context/MainContext";
import dayjs from "dayjs";
import AttendanceChart from "./AttendanceChart";
import SectionDropdown from "./SectionDropdown";
import StudentPopOver from "./StudentPopOver";

const { Title } = Typography;

const AttendanceReport = () => {
  const { batchNumber, sectionsWithAll,setSelectedKey } = useMainContext();
  const [selectedSection, setSelectedSection] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentData, setStudentData] = useState({
    Present: [],
    Absent: [],
    "Half Leave": [],
    "No Status": [],
  });

  // const today = dayjs().format("YYYY-MM-DD");
  let today="2024-01-24"
  const navigate = useNavigate();

  // Popover State
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSelectedSection(sectionsWithAll[0]);
  }, [sectionsWithAll]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAttendanceReport(selectedSection.id, today, batchNumber);

        const colors = {
          Present: "#3CD856",
          Absent: "#FA5A7D",
          "Half Leave": "#f4d03f",
          "No Status": "#ccd1d1",
        };

        setStudentData(response.studentData);
        setAttendanceData(
          Object.keys(response.attendanceCounts).map((status) => ({
            name: status,
            y: response.attendanceCounts[status],
            color: colors[status],
          }))
        );
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchData();
  }, [selectedSection]);

  return (
    <Card style={{ borderRadius: 6, overflow: "hidden",boxShadow: "0 1px 0 0 #cfd7df",height:280 }} bodyStyle={{ padding: "8px 10px" }}>
      <Row justify="space-between" align="middle">
        <Title level={5} style={{ margin:2, marginLeft: 12, color: "#183247" }}>
          Today's Attendance Report
        </Title>
        <Button
          type="text"
          title="more info"
          icon={<InfoCircleOutlined />}
          style={{ borderRadius: 50, color: "#E97451" }}
          onClick={() => {
            navigate("/attendance")
            setSelectedKey("2")
          } }
        />
      </Row>
      <hr style={{  backgroundColor: "#839192", height: ".5px", border: "none" }} />

      <AttendanceChart 
        attendanceData={attendanceData} 
        studentData={studentData} 
        setPopoverVisible={setPopoverVisible} 
        setPopoverContent={setPopoverContent} 
        setPopoverPosition={setPopoverPosition}
      />

      <StudentPopOver 
        popoverVisible={popoverVisible} 
        popoverContent={popoverContent}  
        popoverPosition={popoverPosition} 
        setPopoverVisible={setPopoverVisible} 
      />

      <SectionDropdown sections={sectionsWithAll} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
    </Card>
  );
};

export default AttendanceReport;
