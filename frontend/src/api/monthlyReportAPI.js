import axios from "./axiosInstance";
import { REPORT_API_ENDPOINTS } from "./apiPaths";

export const fetchMonthlyReport = async (section, month, subjects) => {
  try {
    let response = await axios.get(
      `${REPORT_API_ENDPOINTS.MONTHLY_REPORT}${month}/?section=${
        section
      }&subjects=${subjects.join(",")}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
