import React, { createContext, useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { categoryMark } from "../constants/constValues";
import { useMainContext } from "./MainContext";

// Create Context
const MarksContext = createContext();

// Create a Provider Component
export const MarksContextProvider = ({ children }) => {
  const { selectedMonth, selectedSubject } = useMainContext();

  const section = null;
  const batchNumber = 4;

  const [monthId, setMonthId] = useState(selectedSubject.id);
  const [subjectId, setSubjectId] = useState(selectedSubject.id);
  const [testDetail, setTestDetail] = useState({});
  const [showStatus, setShowStatus] = useState(false);
  const [testTableData, setTestTableData] = useState([]);
  const [totalMark, setTotalMark] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [previousTotalMark, setPreviousTotalMark] = useState("");
  const [previousTestName, setPreviousTestName] = useState("");
  const [testId, setTestId] = useState(null);
  const [testNames, setTestNames] = useState([]);
  const [error, setError] = useState("");
  const [isLevelTable, setIsLevelTable] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isMainTable, setIsMainTable] = useState(true);
  const [testDetails, setTestDetails] = useState([]);
  const [mainTableData, setMainTableData] = useState([]);
  const [mainTableColumns, setMainTableColumns] = useState([]);
  const [showMainTableColor, setShowMainTableColor] = useState(false);
  const [aboutTest, setAboutTest] = useState("");
  const [previousAboutTest, setPreviousAboutTest] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openNewTestForm, setOpenNewTestForm] = useState(false);
  const [testDetailCardVisible, setTestDetailCardVisible] = useState(false);

  useEffect(() => {
    setMonthId(selectedMonth.id);
    setSubjectId(selectedSubject.id);
  }, [selectedSubject, selectedMonth]);

  const handleOptionClick = (testId, levelTable) => {
    setTestId(testId);
    setIsMainTable(false);
    setSidebarOpen((prev) => !prev);
    if (levelTable) {
      setIsLevelTable(true);
    } else {
      setIsLevelTable(false);
    }
  };

  return (
    <MarksContext.Provider
      value={{
        categoryMark,
        aboutTest,
        setAboutTest,
        previousAboutTest,
        setPreviousAboutTest,
        isFocused,
        sidebarOpen,
        setSidebarOpen,
        showStatus,
        setShowStatus,
        handleOptionClick,
        openNewTestForm,
        setOpenNewTestForm,
        testDetail,
        setTestDetail,
        testDetailCardVisible,
        setTestDetailCardVisible,
        monthId,
        batchNumber,
        section,
        subjectId,
        testTableData,
        setTestTableData,
        totalMark,
        setTotalMark,
        selectedDate,
        setSelectedDate,
        previousTotalMark,
        setPreviousTotalMark,
        previousTestName,
        setPreviousTestName,
        testId,
        setTestId,
        testNames,
        setTestNames,
        error,
        setError,
        isLevelTable,
        setIsLevelTable,
        isUpdated,
        setIsUpdated,
        isEdited,
        setIsEdited,
        isMainTable,
        setIsMainTable,
        testDetails,
        setTestDetails,
        mainTableData,
        setMainTableData,
        mainTableColumns,
        setMainTableColumns,
        showMainTableColor,
        setShowMainTableColor,
      }}
    >
      {children}
    </MarksContext.Provider>
  );
};

// Custom hook to use context
export const useMarksContext = () => {
  return useContext(MarksContext);
};
