import React, { useEffect } from 'react'
import MonthlyReportMain from './MonthlyReportMain'
import {useMainContext} from '../../Context/MainContext'
function MonthlyReportApp() {

    const {setSelectedSubject,setSelectedKey}=useMainContext()

    useEffect(() => {
        setSelectedKey("3")
        setSelectedSubject({id:null,subject_name:"Monthly Report"})
    }, [])
    

  return (
    <MonthlyReportMain />
  )
}

export default MonthlyReportApp