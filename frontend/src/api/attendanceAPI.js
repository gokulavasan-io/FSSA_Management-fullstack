import axios from "./axiosInstance";
import { ATTENDANCE_API_ENDPOINTS } from "./apiPaths";

export const fetchAttendanceData = async (section, month, year) => {
  let response = await axios.get(
    `${ATTENDANCE_API_ENDPOINTS.ATTENDANCE_DATA}?year=${year}&month=${month}&section_id=${section}`
  );
  return response.data;
};

export const updateAttendance = async (data) => {
  await axios.put(ATTENDANCE_API_ENDPOINTS.ATTENDANCE_DATA, { records: data });
};

export const fetchRemarks = async (section, month, year) => {
  let response = await axios.get(
    `${ATTENDANCE_API_ENDPOINTS.REMARK}?year=${year}&month=${month}&section_id=${section}`
  );
  return response.data;
};

export const addRemark = async (remarkData) => {
  await axios.post(ATTENDANCE_API_ENDPOINTS.REMARK, remarkData);
};

export const deleteRemark = async (remarkData) => {
  await axios.delete(ATTENDANCE_API_ENDPOINTS.REMARK, { data: remarkData });
};

export const checkHoliday = async (date) => {
  const response = await axios.get(
    `${ATTENDANCE_API_ENDPOINTS.CHECK_HOLIDAY}?date=${date}`
  );
  return response.data;
};

export const fetchHolidays = async (section, month, year) => {
  let response = await axios.get(
    `${ATTENDANCE_API_ENDPOINTS.HOLIDAY}?year=${year}&month=${month}&section_id=${section}`
  );
  return response.data;
};

export const addHoliday = async (holidayData) => {
  await axios.post(ATTENDANCE_API_ENDPOINTS.HOLIDAY, holidayData);
};

export const deleteHoliday = async (date) => {
  await axios.delete(ATTENDANCE_API_ENDPOINTS.HOLIDAY, { data: { date } });
};

export const fetchDailyStatistics = async (section, month, year) => {
  let response = await axios.get(
    `${ATTENDANCE_API_ENDPOINTS.DAILY_STATISTICS}?year=${year}&month=${month}&section_id=${section}`
  );
  return response.data;
};

export const fetchStudentStatistics = async (section, month, year) => {
  let response = await axios.get(
    `${ATTENDANCE_API_ENDPOINTS.STUDENT_STATISTICS}?year=${year}&month=${month}&section_id=${section}`
  );
  return response.data;
};
