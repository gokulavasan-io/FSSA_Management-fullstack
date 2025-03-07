import React, { useEffect } from 'react'
import AttendanceMain from "./AttendanceMain"
import { AttendanceContextProvider } from '../../Context/AttendanceContext'
import { useMainContext } from '../../Context/MainContext';


function AttendanceApp() {
  const {setSelectedSubject,setSelectedKey} =  useMainContext()

  useEffect(() => {
    setSelectedKey("2")
    setSelectedSubject({ id: null, subject_name: "Attendance" });
  }, []);

  return (
   <AttendanceContextProvider>
     <AttendanceMain />
   </AttendanceContextProvider>
 
  )
}

export default AttendanceApp