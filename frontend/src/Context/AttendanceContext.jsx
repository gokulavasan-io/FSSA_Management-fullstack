import { createContext, useContext, useState, useRef } from "react";
import { useMainContext } from "./MainContext";

// Create the context
const AttendanceContext = createContext();

// Create a provider component
export const AttendanceContextProvider = ({ children }) => {
  const { selectedMonth } = useMainContext();

  const [monthId, setMonthId] = useState(selectedMonth.id);
  const [tableData, setTableData] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState([]);
  const hotTableRef = useRef(null);

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
        setRemarks,
        hotTableRef,
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
