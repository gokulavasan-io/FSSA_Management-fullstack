import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./Context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Login from "./pages/Login/Login";
import AppLayout from "./Applayout";
import MarkApp from "./pages/MarksEntry/MarksApp";
import AttendanceApp from "./pages/Attendance/AttendanceApp";
import HomeApp from "./pages/Home/HomeApp";
import MonthlyReportApp from "./pages/MonthlyReport/MonthlyReportApp";
import AdminApp from "./pages/Admin/AdminApp";
import Team from "./pages/TopbarSidebar/Topbar/Components/Profile/Team";

export default function Main() {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter> {/* Moved AuthProvider inside BrowserRouter */}
        <AuthProvider>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomeApp />} />
                <Route path="assessment" element={<MarkApp />} />
                <Route path="attendance" element={<AttendanceApp />} />
                <Route path="monthly_report" element={<MonthlyReportApp />} />
                <Route path="admin" element={<AdminApp />} />
                <Route path="team" element={<Team />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </SnackbarProvider>
  );
}
