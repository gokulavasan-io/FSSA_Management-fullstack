import React, { createContext, useState, useContext,useRef } from "react";
import dayjs from "dayjs";
import {categoryMark} from '../../constants/constValues'


// Create Context
const MarksContext = createContext();

// Create a Provider Component
export const MarksContextProvider = ({ children }) => {
  const month = "January";
  const subject = "English";
  const section = null;
  const [testTableData, setTestTableData] = useState([]);
  const [totalMark, setTotalMark] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [previousTotalMark, setPreviousTotalMark] = useState("");
  const [testName, setTestName] = useState("");
  const [previousTestName, setPreviousTestName] = useState("");
  const [testId, setTestId] = useState(null);
  const [testNames, setTestNames] = useState([]);
  const [error, setError] = useState("");
  const [isLevelTable, setIsLevelTable] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isMainTable, setIsMainTable] = useState(true);
  const [testDetails, setTestDetails] = useState([]);
  const [mainTableData, setMainTableData] = useState([]);
  const [mainTableColumns, setMainTableColumns] = useState([]);
  const [showMainTableColor, setShowMainTableColor] = useState(false);
  const [aboutTest, setAboutTest] = useState('');
  const [previousAboutTest,setPreviousAboutTest]=useState('')
  const [isFocused, setIsFocused] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const hotTableRef = useRef(null);

  const handleOptionClick = (testId,levelTable) => {
    setTestId(testId);
    setIsMainTable(false);
    if(levelTable){
      setIsLevelTable(true)
    }else{
      setIsLevelTable(false)
    }
  };
  return (
    <MarksContext.Provider
      value={{
        categoryMark,aboutTest,setAboutTest,previousAboutTest,setPreviousAboutTest,hotTableRef,isFocused,isFocused,sidebarOpen,setSidebarOpen,
        handleOptionClick,
        month,
        section,subject,
        testTableData,
        setTestTableData,
        totalMark,
        setTotalMark,
        selectedDate,
        setSelectedDate,
        previousTotalMark,
        setPreviousTotalMark,
        testName,
        setTestName,
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
        isSaved,
        setIsSaved,
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
