import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "handsontable/dist/handsontable.full.css";
import { SnackbarProvider } from "notistack";
import Attendance from "./pages/Attendance/AttendanceMainTable/attendanceMain";
import DailyStatisticsTable from "./pages/Attendance/Statistics/dailyStatisticts";
import AttendanceStatsTable from "./pages/Attendance/Statistics/studentStatistics";
import { AttendanceContextProvider } from "./pages/Attendance/AttendanceContext";
import AdminPage from "./pages/Admin/adminPage";
import LoginPage from "./pages/Admin/loginPage";
import StudentAdmin from "./pages/Admin/studetntsAdmin";
import Sidebar from "./pages/TopbarSidebar/Sidebar/Sidebar";
import TopBar from "./pages//TopbarSidebar/Topbar/Topbar";
import AppLayout from "./Applayout";
import { useMainContext } from "./Context/MainContext";
import MarkApp from "./pages/MarksEntry/MarksApp";

export default function App() {
  const { isLoggedIn } = useMainContext();

  return (
    <SnackbarProvider maxSnack={3}>
      <AttendanceContextProvider>
        <BrowserRouter>
          {isLoggedIn && (
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                gap: "1rem",
                textDecoration: "none",
              }}
            >
              <li>
                <Link to="/assessment">Mark</Link>
              </li>
              <li>
                <Link to="/attendance">Attendance</Link>
              </li>
              <li>
                <Link to="/dailyStatistics">Daily</Link>
              </li>
              <li>
                <Link to="/studentStatistics">Student</Link>
              </li>
              <li>
                <Link to="/admin/members">Admin</Link>
              </li>
              <li>
                <Link to="/admin/student">Admin</Link>
              </li>
              {/* <li><Link to='/'>Login</Link></li> */}
            </ul>
          )}
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<MarkApp />} />
              <Route path="assessment" element={<MarkApp />} />
              <Route path="attendance" element={<Attendance />} />
            </Route>
            {/* <Route path='/sidebar' element={ <Sidebar />} />
                <Route path='/' element={ <TopBar />} />
                <Route path='/mark' element={ <MarkApp />} />
                <Route path='/attendance' element={ <Attendance {...props} />} />
                <Route path='/dailyStatistics' element={ <DailyStatisticsTable {...props} />} />
                <Route path='/studentStatistics' element={ <AttendanceStatsTable  {...props}/>} />
                <Route path='/admin/members' element={ <AdminPage />} />
                <Route path='/admin/student' element={ <StudentAdmin />} />
                <Route path='/login' element={ <LoginPage setIsLoggedIn={setIsLoggedIn} />} /> */}
          </Routes>
        </BrowserRouter>
      </AttendanceContextProvider>
    </SnackbarProvider>
  );
}
