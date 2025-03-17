import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "handsontable/dist/handsontable.full.css";
import { SnackbarProvider } from "notistack";
import Login from "./pages/Login/Login";
import AppLayout from "./Applayout";
import MarkApp from "./pages/MarksEntry/MarksApp";
import AttendanceApp from "./pages/Attendance/AttendanceApp";
import HomeApp from "./pages/Home/HomeApp";
import MonthlyReportApp from "./pages/MonthlyReport/MonthlyReportApp";
import  AnalyticsApp  from './pages/Analytics/AnalyticsApp'


export default function Main() {
  return (
    <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomeApp />} />
              <Route path="assessment" element={<MarkApp />} />
              <Route path="attendance" element={<AttendanceApp />} />
              <Route path="monthly_report" element={<MonthlyReportApp />} />
              <Route path="analytics" element={<AnalyticsApp />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </SnackbarProvider>
  );
}
