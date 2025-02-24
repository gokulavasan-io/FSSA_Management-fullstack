import React, { createContext, useState, useContext } from "react";

// Create Context
const MainContext = createContext();

// Create a Provider Component
export const MainContextProvider = ({ children }) => {


    const [monthNow,setMonthNow]=useState({ id: 1, month_name: "January" })
    const [selectedMonth, setSelectedMonth] = useState({ id: 1, month_name: "January" });
    const [selectedSubject, setSelectedSubject] = useState({id:1,subject_name:"English"})
    const [sectionId, setSectionId] = useState(3)
    const [batchNumber, setBatchNumber] = useState(4)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [year, setYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId,setUserId]=useState(1)
    const [userName,setUserName]=useState("")
    const [userRole,setUserRole]=useState("")
    const [userMailId,setUserMailId]=useState("")
    const [sectionName,setSectionName]=useState(1)


    
  return (
    <MainContext.Provider
      value={{
        selectedMonth,setSelectedMonth,batchNumber,setBatchNumber,selectedSubject,setSelectedSubject,sectionId,setSectionId,userId,setUserId,isLoggedIn,setIsLoggedIn,
        year,setYear,months, setMonths,subjects, setSubjects,monthNow,setMonthNow,loading, setLoading,
        userName,setUserName,userMailId,setUserMailId,sectionName,setSectionName,setUserRole,userRole
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

// Custom hook to use context
export const useMainContext = () => {
  return useContext(MainContext);
};
