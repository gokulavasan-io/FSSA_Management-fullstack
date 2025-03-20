import axios from "./axiosInstance";
import { ATTENDANCE_API_ENDPOINTS } from "./apiPaths";

export const fetchAttendanceData = async (section, month, year) => {
  try {
    let response = await axios.get(
      `${ATTENDANCE_API_ENDPOINTS.ATTENDANCE_DATA}?year=${year}&month=${
        month
      }&section_id=${section}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAttendance = async (data) => {
  try {
    await axios.put(ATTENDANCE_API_ENDPOINTS.ATTENDANCE_DATA, {
      records: data,
    });
  } catch (error) {
    throw error;
  }
};

export const fetchRemarks = async (section, month, year) => {
  try {
    let response = await axios.get(
      `${ATTENDANCE_API_ENDPOINTS.REMARK}?year=${year}&month=${
        month
      }&section_id=${section}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRemark = async (remarkData) => {
  try {
    await axios.post(ATTENDANCE_API_ENDPOINTS.REMARK, remarkData);
  } catch (error) {
    throw error;
  }
};

export const deleteRemark = async (remarkData) => {
  try {
    await axios.delete(ATTENDANCE_API_ENDPOINTS.REMARK, { data: remarkData });
  } catch (error) {
    throw error;
  }
};

export const checkHoliday = async (date) => {
  try {
    const response = await axios.get(
      `${ATTENDANCE_API_ENDPOINTS.CHECK_HOLIDAY}?date=${date}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchHolidays = async (section, month, year) => {
  try {
    let response = await axios.get(
      `${ATTENDANCE_API_ENDPOINTS.HOLIDAY}?year=${year}&month=${
        month
      }&section_id=${section}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addHoliday = async (holidayData) => {
  try {
    await axios.post(ATTENDANCE_API_ENDPOINTS.HOLIDAY, holidayData);
  } catch (error) {
    throw error;
  }
};

export const deleteHoliday = async (date) => {
  try {
    await axios.delete(ATTENDANCE_API_ENDPOINTS.HOLIDAY, {
      data: { date },
    });
  } catch (error) {
    throw error;
  }
};

export const fetchDailyStatistics = async (section, month, year) => {
  try {
    let response = await axios.get(
      `${ATTENDANCE_API_ENDPOINTS.FETCH_DAILY_STATISTICS}?year=${
        year
      }&month=${month}&section_id=${section}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStudentStatistics = async (section, month, year) => {
  try {
    let response = await axios.get(
      `${ATTENDANCE_API_ENDPOINTS.FETCH_STUDENT_STATISTICS}?year=${
        year
      }&month=${month}&section_id=${section}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
