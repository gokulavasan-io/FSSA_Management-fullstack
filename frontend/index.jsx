import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MarkEntry from './src/pages/marksEntry/marksEntry'
import 'handsontable/dist/handsontable.full.css';
import ChatUI from './src/pages/AiChat/chat'
import Attendance from './src/pages/attendance/attendanceMain';
import DailyStatisticsTable from './src/pages/attendance/dailyStatisticts';
import AttendanceStatsTable from './src/pages/attendance/studentStatistics';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* <MarkEntry />
      // <ChatUI /> */}
       <Attendance year={2024} month={12} sectionId={1} />
       {/* <DailyStatisticsTable  // Replace with your backend API URL
        sectionId={1}  // Replace with the actual section ID
        month={12}  // Replace with the desired month (e.g., January)
        year={2024}  // Replace with the desired year
      /> */}
  {/* <AttendanceStatsTable sectionId={1}  
        month={12}  
        year={2024} /> */}
  </StrictMode>
)
