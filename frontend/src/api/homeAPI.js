import axios from "./axiosInstance";
import { HOME_API_ENDPOINTS } from "./apiPaths";

export const fetchAttendanceReport = async (section, date, batch) => {
  let response = await axios.get(
    `${HOME_API_ENDPOINTS.ATTENDANCE_REPORT}?date=${date}&section_id=${section}&batch=${batch}`
  );
  return response.data;
};

export const fetchMonthlyReport = async (batch, subjects) => {
  let response = await axios.get(
    `${HOME_API_ENDPOINTS.MONTHLY_REPORT}?batch=${batch}&subjects=${subjects.join(",")}`
  );
  return response.data;
};

export const fetchSubjectReport = async (batch, subjects) => {
  let response = await axios.get(
    `${HOME_API_ENDPOINTS.SUBJECT_REPORT}?batch=${batch}&subjects=${subjects.join(",")}`
  );
  return response.data;
};
