import React, { useEffect } from 'react'
import AttendanceMain from "./AttendanceMain"
import { AttendanceContextProvider } from '../../Context/AttendanceContext'


function AttendanceApp() {
  return (
   <AttendanceContextProvider>
     <AttendanceMain />
   </AttendanceContextProvider>
 
  )
}

export default AttendanceApp