import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context
const MainContext = createContext();

// Create a Provider Component
export const MainContextProvider = ({ children }) => {

    const [monthNow,setMonthNow]=useState({ id: 1, month_name: "January" })
    const [selectedMonth, setSelectedMonth] = useState({ id: 1, month_name: "January" });
    const [selectedSubject, setSelectedSubject] = useState({id:1,subject_name:"English"})
    const [sectionId, setSectionId] = useState(3)
    const [sectionName,setSectionName]=useState(2)
    const [batchNumber, setBatchNumber] = useState(4)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [year, setYear] = useState(2024);
    const [months, setMonths] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId,setUserId]=useState(1)
    const [userName,setUserName]=useState("")
    const [userRole,setUserRole]=useState("")
    const [userMailId,setUserMailId]=useState("")
    const [sections,setSections]=useState([])
    const [sectionsWithAll,setSectionsWithAll]=useState([])
    const [academicSubjects, setAcademicSubjects] = useState([]);
    const [selectedKey, setSelectedKey] = useState("1");


    useEffect(() => {
      setSectionsWithAll([{ name: "All", id: null }, ...sections])
    }, [sections])
    

    useEffect(() => {
      let academicSubjectNames = new Set(["English", "Tech", "Life Skills","Problem Solving"]);
      setAcademicSubjects(subjects.filter(subject => academicSubjectNames.has(subject.subject_name)))
    }, [subjects])
    
  return (
    <MainContext.Provider
      value={{
        selectedMonth,setSelectedMonth,batchNumber,setBatchNumber,selectedSubject,setSelectedSubject,sectionId,setSectionId,userId,setUserId,isLoggedIn,setIsLoggedIn,
        year,setYear,months, setMonths,subjects, setSubjects,monthNow,setMonthNow,loading, setLoading,setSelectedKey,selectedKey,
        userName,setUserName,userMailId,setUserMailId,sectionName,setSectionName,setUserRole,userRole,sections,setSections,sectionsWithAll,setSectionsWithAll,
        academicSubjects,setAcademicSubjects
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
