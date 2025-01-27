// MyContext.js
import React, { createContext, useState,useRef } from 'react';

// Create the context
const AttendanceContext = createContext();

// Create a provider component
export const AttendanceContextProvider = ({ children }) => {

  let [month, setMonth] = useState(12)
  let [year, setYear] = useState(2024)
  let [sectionId, setSectionId] = useState(1)
  
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState([]); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remark, setRemark] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef(null);
  const hotTableRef = useRef(null);
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");
  const [holidayReasonDialogOpen, setHolidayReasonDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);

  return (
    <AttendanceContext.Provider
  value={{
    data,setData,columns,setColumns,attendanceData,setAttendanceData,totalWorkingDays,setTotalWorkingDays,
    month, setMonth,year, setYear,sectionId, setSectionId,
    tableData,
    setTableData,
    statusOptions,
    setStatusOptions,
    loading,
    setLoading,
    remarks,
    setRemarks,
    sidebarOpen,
    setSidebarOpen,
    tableVisible,
    setTableVisible,
    students,
    setStudents,
    dialogOpen,
    setDialogOpen,
    selectedRow,
    setSelectedRow,
    remark,
    setRemark,
    tooltipPosition,
    setTooltipPosition,
    isTooltipVisible,
    setIsTooltipVisible,
    tooltipRef,
    hotTableRef,
    holidays,
    setHolidays,
    selectedDate,
    setSelectedDate,
    isHoliday,
    setIsHoliday,
    holidayReason,
    setHolidayReason,
    holidayReasonDialogOpen,
    setHolidayReasonDialogOpen,
    confirmationDialogOpen,
    setConfirmationDialogOpen,
  }}
>
  {children}
</AttendanceContext.Provider>

  );
};

export default AttendanceContext;
