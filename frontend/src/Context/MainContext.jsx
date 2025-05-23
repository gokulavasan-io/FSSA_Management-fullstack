import React, { createContext, useState, useContext, useEffect } from "react";

const MainContext = createContext();

export const MainContextProvider = ({ children }) => {

    const [selectedMonth, setSelectedMonth] = useState({});
    const [selectedSubject, setSelectedSubject] = useState({})
    const [year, setYear] = useState(2025);
    const [months, setMonths] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sections,setSections]=useState([])
    const [sectionsWithAll,setSectionsWithAll]=useState([])
    const [academicSubjects, setAcademicSubjects] = useState([]);
    const [selectedKey, setSelectedKey] = useState("1");
    const [attendanceBehaviorIds, setAttendanceBehaviorIds] = useState([]);
    const [problemSolvingId,setProblemSolvingId]=useState(null)
    const [categoryName,setCategoryName]=useState("")

    const [userId,setUserId]=useState(localStorage.getItem("userId"))
    const [userName,setUserName]=useState("")
    const [userRole,setUserRole]=useState("")
    const [userMailId,setUserMailId]=useState("")
    const [sectionId, setSectionId] = useState(null)
    const [sectionName,setSectionName]=useState("")
    const [batchNumber, setBatchNumber] = useState(4)
    const [userImageUrl, setUserImageUrl] = useState(null)



    useEffect(() => {
      setSectionsWithAll([{ name: "All", id: null }, ...sections])
    }, [sections])
    
    const requiredSubjects=new Set(["English", "Tech", "Life Skills","Problem Solving","PET","Project"])
    useEffect(() => {
      let academicSubjectNames = new Set(["English", "Tech", "Life Skills","Problem Solving"]);
      setAcademicSubjects(subjects.filter(subject => academicSubjectNames.has(subject.subject_name)))

      const problemSolvingSubject = subjects.find(subject => subject.subject_name === "Problem Solving");
      setProblemSolvingId(problemSolvingSubject ? problemSolvingSubject.id : null);
      
      let attendanceBehavior=["Attendance","Behavior"]
      setAttendanceBehaviorIds(subjects
        .filter(subject => attendanceBehavior.includes(subject.subject_name) )
        .map(subject => subject.id)); 
    }, [subjects])
 

 
  return (
    <MainContext.Provider
      value={{
        selectedMonth,setSelectedMonth,batchNumber,setBatchNumber,selectedSubject,setSelectedSubject,sectionId,setSectionId,userId,setUserId,userImageUrl, setUserImageUrl,
        year,setYear,months, setMonths,subjects, setSubjects,loading, setLoading,setSelectedKey,selectedKey,requiredSubjects,
        userName,setUserName,userMailId,setUserMailId,sectionName,setSectionName,setUserRole,userRole,sections,setSections,sectionsWithAll,setSectionsWithAll,
        academicSubjects,setAcademicSubjects,attendanceBehaviorIds, setAttendanceBehaviorIds,problemSolvingId,setProblemSolvingId,categoryName,setCategoryName,
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
