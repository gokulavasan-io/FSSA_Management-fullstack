import axios from "./axiosInstance";
import { MONTHLY_REPORT_API_ENDPOINTS } from "./apiPaths";

export const fetchMonthlyReport = async (section, month, subjects) => {
  try {
    let response = await axios.get(
      `${MONTHLY_REPORT_API_ENDPOINTS.MONTHLY_REPORT}${month}/?section=${
        section
      }&subjects=${subjects.join(",")}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
