import React, { useEffect, useState } from "react";
import "dayjs/locale/en";
import Handsontable from "handsontable";
import useAttendanceContext from "../../Context/AttendanceContext";
import {
  fetchAttendanceData,
  fetchRemarks,
  updateAttendance,
} from "../../api/attendanceAPI";
import AttendanceTable from "./Components/Table/AttendanceTable";
import { useMainContext } from "../../Context/MainContext";
import "./Styles/attendance.css";
import { Dropdown, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import ShowComments from "./Components/Comments/ShowComments";
import ShowHolidays from "./Components/Holiday/ShowHolidays";
import DailyStatisticsTable from "./Components/Statistics/DailyStatistics";
import StudentStatisticsTable from "./Components/Statistics/StudentStatistics";
import { FwButton } from "@freshworks/crayons/react";
import Loader from "../Components/Loader";


const AttendanceMain = () => {
  const { year, sectionId } = useMainContext();
  const {
    monthId,
    tableData,
    setTableData,
    statusOptions,
    setStatusOptions,
    remarks,
    setRemarks,
    setCommentsTableVisible,
    setHolidaysTableVisible,
    setDailyStatisticsVisible,
    setStudentStatisticsVisible,
  } = useAttendanceContext();
  const [loading, setLoading] = useState(true)
  const [daysCount,setDaysCount]=useState(null)

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setCommentsTableVisible(true)}>
        Comments
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setHolidaysTableVisible(true)}>
        Holidays
      </Menu.Item>
      <Menu.Item key="3" onClick={() => setStudentStatisticsVisible(true)}>
        Student Statistics
      </Menu.Item>
      <Menu.Item key="4" onClick={() => setDailyStatisticsVisible(true)}>
        Daily Statistics
      </Menu.Item>
    </Menu>
  );

  const fetchAttendance = async () => {
    setLoading(true)
    if (monthId==undefined||year==undefined) {
      setLoading(false)
      return
    }
    try {
      const [response, fetchedRemarks] = await Promise.all([
        fetchAttendanceData(sectionId, monthId, year),
        fetchRemarks(sectionId, monthId, year)
      ]);
  
      const { data, status,daysCount } = response;
      setRemarks(fetchedRemarks);
      setTableData(data);
      setStatusOptions(status);
      setDaysCount(daysCount)
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }finally{
    setLoading(false)

    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [year, monthId, sectionId]);

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
        month: monthId,
        attendance,
      };
    });

    try {
      await updateAttendance(updatedRecords);
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance.");
    } 
  };

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
      title: `${day}/${monthId}`,
      type: "dropdown",
      source: statusOptions.filter(
        (status) => status !== "HD" && status !== "WE"
      ),
      allowInvalid: false,
      readOnly: tableData.some(
        (row) => row[day] === "HD" || row[day] === "WE"
      ),
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        const isHoliday = tableData[row]?.[day] === "HD";
        const isWeekend = tableData[row]?.[day] === "WE";
        const date = `${year}-${String(monthId).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;

        // Check if there's a remark for the student on this day
        const studentId = tableData[row]?.student_id;

        const remarkForThisDay = remarks.find((remark) =>
          remark.attendance.some(
            (attendance) =>
              attendance.date === date && remark.student_id === studentId
          )
        );


        if (remarkForThisDay) {
          td.classList.add("remarkCell");
        }
        if (isHoliday && !isWeekend) {
          td.classList.remove("handsontableDropdown");
          td.classList.add("holidayCell");
        } else if (isWeekend) {
          td.classList.remove("handsontableDropdown");
          td.classList.add("weekendCell");
        } else {
          Handsontable.renderers.DropdownRenderer.apply(this, arguments); 
        }
      },
    })),
  ];

  return (
      loading ? <Loader/> : 
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: -12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <FwButton
            color="secondary"
            onFwClick={handleUpdateAttendance}
          >
            Update
          </FwButton>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              shape="circle"
              type="text"
              icon={<MenuOutlined style={{ fontSize: "18px", color: "black" }} />}
            />
          </Dropdown>
        </div>
  
        <AttendanceTable
          tableData={tableData}
          hotColumns={hotColumns}
          handleAfterChange={handleAfterChange}
          remarksData={remarks}
          handleUpdateAttendance={handleUpdateAttendance}
        />
  
        <ShowComments />
        <ShowHolidays />
        <DailyStatisticsTable />
        <StudentStatisticsTable />
      </div>
  );
};

export default AttendanceMain;
