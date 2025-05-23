import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useMainContext } from "./MainContext";

const AttendanceContext = createContext();

export const AttendanceContextProvider = ({ children }) => {
  const { selectedMonth } = useMainContext();
  
  const [monthId, setMonthId] = useState(selectedMonth.id);
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState([]);

  const [commentsTableVisible, setCommentsTableVisible] = useState(false);
  const [holidaysTableVisible, setHolidaysTableVisible] = useState(false);
  const [dailyStatisticsVisible, setDailyStatisticsVisible] = useState(false);
  const [studentStatisticsVisible, setStudentStatisticsVisible] = useState(false);
  
  useEffect(() => {
    setMonthId(selectedMonth.id)
  }, [selectedMonth])
  
  

  return (
    <AttendanceContext.Provider
      value={{
        monthId,
        setMonthId,
        tableData,
        setTableData,
        statusOptions,
        setStatusOptions,
        loading,
        setLoading,
        remarks,
        setRemarks,commentsTableVisible, setCommentsTableVisible,holidaysTableVisible, setHolidaysTableVisible,
        dailyStatisticsVisible,setDailyStatisticsVisible,studentStatisticsVisible,setStudentStatisticsVisible,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

const useAttendanceContext = () => {
  return useContext(AttendanceContext);
};

export default useAttendanceContext;
