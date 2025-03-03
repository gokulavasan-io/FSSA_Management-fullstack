import React, { useEffect, useState } from "react";
import { Card, Row, Typography, Button, Popover, Empty } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { fetchAttendanceReport } from "../../../api/homeAPI";
import { useMainContext } from "../../../Context/MainContext";
import dayjs from 'dayjs';

const { Title } = Typography;

const AttendanceReport = () => {

  const today = dayjs().format('YYYY-MM-DD');

  const {sectionId,batchNumber}=useMainContext()
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({ Present: [],  Absent: [],"Half Leave": [],"No Status":[] });
  const [attendanceData, setAttendanceData] = useState([]);
  const [popoverContent, setPopoverContent] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAttendanceReport(sectionId, today,batchNumber);

        const colors = {
          Present: "#3CD856",
          Absent: "#FA5A7D",
          "Half Leave": "#f4d03f",
          "No Status":"#ccd1d1"
        };

        setStudentData(response.studentData);

        // Create attendance data with color
        setAttendanceData(Object.keys(response.attendanceCounts).map((status) => ({
          name: status,
          y: response.attendanceCounts[status],
          color: colors[status],
        })));
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchData();
  }, [sectionId, today]);

  const options = {
    chart: {
      type: "pie",
      height: 180,
    },
    title: false,
    series: [
      {
        name: "Students",
        colorByPoint: true,
        data: attendanceData,
      },
    ],
    accessibility: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        center: ["50%", "50%"],
        events: {
          click: function (event) {
            const category = event.point.name;
            const students = studentData[category] || [];
            setPopoverContent(
              <div>
                <Title level={5} style={{ color: "#8e44ad" }}>{category} Students</Title>
                <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "500px", gap: "5px" }}>
                  {students.length > 0
                    ? students.map((student, index) => (
                        <span key={index} style={{ display: "inline-block", color: "#71797E" }}>
                          {`${student}, `}
                        </span>
                      ))
                    : "No students"}
                </div>
              </div>
            );
            setPopoverPosition({ x: event.pageX, y: event.pageY - 100 });
            setPopoverVisible(true);
          },
        },
      },
    },
    legend: {
      itemStyle: {
        fontSize: "9px", 
      },
    },
  };
  
  return (
    <Card
      style={{ borderRadius: 12, width: 380, height: 220, overflow: "hidden" }}
      bodyStyle={{ padding: "8px 10px" }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 1 }}>
        <Title level={5} style={{ margin: 0, marginLeft: 8, color: "#0047AB" }}>
          Today's Attendance Report
        </Title>
        <Button type="text" icon={<InfoCircleOutlined />} style={{ borderRadius: 50, color: "#E97451" }} onClick={() => navigate("/attendance")} />
      </Row>


      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

      <Popover
        content={popoverContent}
        open={popoverVisible}
        trigger="click"
        placement="rightTop"
        onOpenChange={(visible) => !visible && setPopoverVisible(false)}
        arrow={true}
      >
        <div style={{ position: "absolute", left: popoverPosition.x, top: popoverPosition.y }} />
      </Popover>
    </Card>
  );
};

export default AttendanceReport;
