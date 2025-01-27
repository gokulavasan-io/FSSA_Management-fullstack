import React from 'react'
import { BrowserRouter,Route,Routes ,Link} from 'react-router-dom';

import MarkEntry from './pages/marksEntry/marksEntry'
import 'handsontable/dist/handsontable.full.css';
import { SnackbarProvider } from 'notistack';
import Attendance from './pages/Attendance/AttendanceMainTable/attendanceMain';
import DailyStatisticsTable from './pages/Attendance/Statistics/dailyStatisticts';
import AttendanceStatsTable from './pages/Attendance/Statistics/studentStatistics';
import { AttendanceContextProvider } from './pages/Attendance/AttendanceContext';

let sectionId=null;
let month=12;
let year=2024;

export default function App() {
    let props={sectionId,month,year}

  return (
    <SnackbarProvider maxSnack={3}>
        <AttendanceContextProvider>
        <BrowserRouter>
            <ul style={{ display: 'flex', listStyle: 'none',gap:'1rem',textDecoration:"none" }}>
                <li><Link to='/'>Mark</Link></li>
                <li><Link to='/attendance'>Attendance</Link></li>
                <li><Link to='/dailyStatistics'>Daily</Link></li>
                <li><Link to='/studentStatistics'>Student</Link></li>
            </ul>
            <Routes>
                <Route path='/' element={ <MarkEntry />} />
                <Route path='/attendance' element={ <Attendance {...props} />} />
                <Route path='/dailyStatistics' element={ <DailyStatisticsTable {...props} />} />
                <Route path='/studentStatistics' element={ <AttendanceStatsTable  {...props}/>} />
            </Routes>

        </BrowserRouter>
        </AttendanceContextProvider>

    </SnackbarProvider>
  )
}
